# Pokety - AI Expense Parser

An intelligent expense tracking application that uses AI to parse expense text and categorize transactions.

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
