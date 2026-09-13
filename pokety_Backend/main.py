import os
import re
import sqlite3
from datetime import datetime
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB_FILE = os.path.join(os.path.dirname(__file__), "expenses.db")

app = FastAPI(title="Pokety API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            merchant TEXT NOT NULL,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            raw_text TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


class ExpenseRequest(BaseModel):
    text: str = Field(..., min_length=1)


class SplitExpenseRequest(BaseModel):
    total_amount: float = Field(..., gt=0)
    participants: List[str] = Field(default_factory=lambda: ["Aarav", "Mira", "Rohan"])
    payer: str | None = None


def extract_amount(text: str) -> float:
    matches = re.findall(r"(?:rs|inr|₹)?\s*(\d+(?:\.\d+)?)", text.lower().replace(",", ""))
    if not matches:
        return 0.0
    return float(matches[0])


def infer_category(text: str) -> str:
    lowered = text.lower()
    keywords = {
        "dining": ["dinner", "pizza", "food", "lunch", "coffee", "restaurant", "zomato", "swiggy"],
        "travel": ["uber", "ola", "travel", "petrol", "fuel", "train", "bus", "flight", "auto"],
        "shopping": ["shopping", "clothes", "shirt", "jeans", "amazon", "flipkart"],
        "groceries": ["grocery", "milk", "vegetables", "mart", "supermarket"],
        "entertainment": ["netflix", "movie", "spotify", "music", "cinema"],
        "bills": ["electricity", "wifi", "rent", "water", "internet", "bill"],
    }
    for category, words in keywords.items():
        if any(word in lowered for word in words):
            return category
    return "general"


def infer_merchant(text: str) -> str:
    cleaned = re.sub(r"\b(?:spent|paid|bought|purchase|on)\b", "", text, flags=re.IGNORECASE)
    cleaned = cleaned.strip()
    if not cleaned:
        return "Unknown"
    first = cleaned.split()[0:3]
    return " ".join(first).title()


def parse_with_ai(text: str):
    amount = extract_amount(text)
    category = infer_category(text)
    merchant = infer_merchant(text)
    current_date = datetime.now().strftime("%Y-%m-%d")

    return {
        "amount": amount,
        "category": category,
        "merchant": merchant,
        "date": current_date,
        "type": "expense",
        "raw_text": text,
    }


@app.get("/")
def home():
    return {"status": "running", "service": "Pokety AI Backend with SQLite"}


@app.post("/api/v1/parse-expense")
@app.post("/parse-expense")
def parse_and_save_expense(req: ExpenseRequest):
    parsed_data = parse_with_ai(req.text)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO expenses (amount, category, merchant, date, type, raw_text)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            parsed_data["amount"],
            parsed_data["category"],
            parsed_data["merchant"],
            parsed_data["date"],
            parsed_data["type"],
            req.text,
        ),
    )
    conn.commit()
    conn.close()

    return {"message": "Expense saved successfully", "data": parsed_data}


@app.get("/expenses")
def get_expenses():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM expenses ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


@app.get("/analytics")
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT category, SUM(amount) FROM expenses GROUP BY category")
    rows = cursor.fetchall()
    conn.close()

    return {row["category"]: row["SUM(amount)"] for row in rows}


@app.post("/split-expense")
def split_expense(req: SplitExpenseRequest):
    participants = req.participants or ["Aarav", "Mira", "Rohan"]
    total = float(req.total_amount)
    share = total / len(participants)

    split = []
    for person in participants:
        split.append({"name": person, "share": round(share, 2), "payer": person == (req.payer or participants[0])})

    return {
        "total_amount": total,
        "participants": len(participants),
        "per_person": round(share, 2),
        "split": split,
    }