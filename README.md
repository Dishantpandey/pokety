
# 💳 Pokety — AI Expense Tracker

Pokety is an intelligent, AI-powered expense tracking application designed to help users manage their finances effortlessly. By leveraging Large Language Models (LLMs), Natural Language Processing (NLP), and predictive analytics, Pokety automatically categorizes transactions and generates personalized budgeting recommendations.

---

## 🏗️ Project Architecture

The repository is organized into distinct modules supporting the cross-platform experience:

* **`pokety_Backend/`** — Server-side application handling API requests, business logic, and AI integrations (Python, LLM & NLP pipelines).
* **`pokety_Frontend/`** — Cross-platform mobile client built for users to track expenses on the go (Flutter).
* **`pokety_Web/`** — Web-based client interface for desktop and browser access.
* **`venv/`** — Python virtual environment configuration.

---

## ⚙️ Key Features

* **AI Auto-Categorization:** Uses NLP and LLMs to automatically parse and classify user transactions into intuitive expense categories.
* **Predictive Budgeting:** Analyzes spending trends to deliver customized budgeting recommendations and financial alerts.
* **Cross-Platform Support:** Seamless synchronization across mobile (`pokety_Frontend`) and web (`pokety_Web`) interfaces via Firebase.
* **RESTful API Backend:** Robust Python-based backend handling secure user data and model predictions.

---

## 🛠️ Tech Stack

* **Core Language:** Python
* **Frontend Framework:** Flutter
* **Backend / Database:** Firebase, REST API
* **Intelligence:** LLMs, NLP, Predictive Analytics

---

## 🚀 Getting Started

Quick setup scripts are included in the root directory for convenience:
* Run `run_pokety.bat` / `run_pokety.ps1` to launch the application workflow.
* Use `start_backend.bat` and `start_frontend.bat` to boot services independently.

## Project Structure

```
pokety/
├── pokety_Backend/       # Python FastAPI backend
│   ├── main.py          # FastAPI application
│   ├── requirements.txt  # Python dependencies
│   ├── .env             # Environment variables (GROQ_API_KEY)
│   └── serviceAccountKey.json  # Firebase credentials
└── pokety_Frontend/      # Flutter mobile app
    ├── lib/
    │   ├── main.dart    # Main Flutter app
    │   ├── models/      # Data models
    │   └── services/    # API services
    ├── pubspec.yaml     # Flutter dependencies
    └── ...
```

## Backend Setup

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

1. Navigate to the backend directory:
```bash
cd pokety_Backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```
- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Ensure you have:
   - `.env` file with `GROQ_API_KEY`
   - `serviceAccountKey.json` for Firebase

### Running the Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

## Frontend Setup

### Prerequisites
- Flutter SDK 3.13.0 or higher
- Dart SDK

### Installation

1. Navigate to the frontend directory:
```bash
cd pokety_Frontend
```

2. Get Flutter dependencies:
```bash
flutter pub get
```

### Running the Frontend

- **Web:**
  ```bash
  flutter run -d chrome
  ```

- **Android:**
  ```bash
  flutter run -d android
  ```

- **iOS:**
  ```bash
  flutter run -d ios
  ```

## API Endpoints

### Parse Expense
- **POST** `/api/v1/parse-expense`
- **Request:**
  ```json
  {
    "text": "Spent 500 on dinner at Zomato"
  }
  ```
- **Response:**
  ```json
  {
    "amount": 500.0,
    "currency": "INR",
    "category": "Dining",
    "merchant": "Zomato",
    "date": "2024-01-15",
    "type": "expense"
  }
  ```

### Health Check
- **GET** `/`
- **Response:**
  ```json
  {
    "status": "running",
    "service": "Pokety AI Backend with Groq"
  }
  ```

## Configuration

### Backend (.env file)
```
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (API URL)
Update the `baseUrl` in `lib/services/api_service.dart` to match your backend server:
```dart
static const String baseUrl = 'http://localhost:8000';  // For local development
// static const String baseUrl = 'http://your.server.ip:8000';  // For remote server
```

## Troubleshooting

### Backend Issues
- **ModuleNotFoundError:** Make sure virtual environment is activated and all dependencies are installed
- **Connection refused:** Ensure backend is running on the correct port
- **GROQ_API_KEY error:** Verify `.env` file exists and contains the correct API key

### Frontend Issues
- **Connection timeout:** Check if backend is running and accessible from your device/emulator
- **JSON parsing error:** Ensure backend is returning valid JSON responses
- **Flutter version mismatch:** Run `flutter upgrade` to update Flutter SDK

## Development

### Backend Development
- Hot reload is enabled with `--reload` flag
- Check FastAPI docs at `http://localhost:8000/docs`

### Frontend Development
- Hot reload works with `flutter run`
- Use Flutter DevTools: `flutter pub global activate devtools && devtools`

## License

Proprietary - Pokety Project
