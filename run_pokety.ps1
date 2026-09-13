$ErrorActionPreference = "Stop"

function Stop-PortProcesses([int]$Port) {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if (-not $connections) { return }

    foreach ($connection in $connections) {
        if ($connection.OwningProcess) {
            try {
                Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
            } catch {}
        }
    }
}

function Get-FreePort([int]$PreferredPort) {
    $port = $PreferredPort
    while ($true) {
        $inUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if (-not $inUse) {
            return $port
        }
        $port++
        if ($port -gt 65535) { throw "No free ports available." }
    }
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "pokety_Backend"
$frontendDir = Join-Path $root "pokety_Frontend"
$backendVenvPython = Join-Path $backendDir "venv\Scripts\python.exe"
$backendRequirements = Join-Path $backendDir "requirements.txt"

if (-not (Test-Path $backendDir)) {
    throw "Backend folder not found: $backendDir"
}

if (-not (Test-Path $frontendDir)) {
    throw "Frontend folder not found: $frontendDir"
}

Stop-PortProcesses -Port 8000
Stop-PortProcesses -Port 8080
Stop-PortProcesses -Port 8081

$backendPort = Get-FreePort -PreferredPort 8000
$frontendPort = Get-FreePort -PreferredPort 8080

if (-not (Test-Path $backendVenvPython)) {
    Write-Host "Creating backend virtual environment..."
    Set-Location $backendDir
    python -m venv venv
}

Write-Host "Installing backend dependencies..."
& $backendVenvPython -m pip install -r $backendRequirements

Write-Host "Starting backend on port $backendPort..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; & '$backendVenvPython' -m uvicorn main:app --reload --host 0.0.0.0 --port $backendPort"

Write-Host "Installing frontend dependencies..."
Set-Location $frontendDir
flutter pub get

Write-Host "Starting frontend web server on port $frontendPort..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendDir'; flutter run -d web-server --web-hostname 127.0.0.1 --web-port=$frontendPort --dart-define=API_BASE_URL=http://127.0.0.1:$backendPort"

Write-Host "Waiting for the frontend to finish its first build..."
$frontendReady = $false
for ($attempt = 0; $attempt -lt 36; $attempt++) {
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$frontendPort/" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            $frontendReady = $true
            break
        }
    } catch {}
}

if (-not $frontendReady) {
    throw "Frontend did not become available on port $frontendPort within 3 minutes."
}

Write-Host ""
Write-Host "Pokety is starting..."
Write-Host "Backend docs: http://localhost:$backendPort/docs"
Write-Host "Frontend app: http://localhost:$frontendPort/"
Write-Host ""
Start-Process "http://127.0.0.1:$frontendPort/"
