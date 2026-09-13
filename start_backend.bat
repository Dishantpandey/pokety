@echo off
cd /d "%~dp0pokety_Backend"

for %%p in (8000 8001 8002 8003 8004 8005) do (
    netstat -ano | findstr :%%p >nul
    if not errorlevel 1 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
            taskkill /PID %%a /F >nul 2>&1
        )
    )
)

if not exist venv\Scripts\python.exe (
    python -m venv venv
)
call venv\Scripts\activate.bat
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
