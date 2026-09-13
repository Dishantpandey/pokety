@echo off
cd /d "%~dp0pokety_Frontend"

for %%p in (8080 8081 8082 8083 8084 8085) do (
    netstat -ano | findstr :%%p >nul
    if not errorlevel 1 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
            taskkill /PID %%a /F >nul 2>&1
        )
    )
)

flutter pub get
flutter run -d chrome --web-port=8080
