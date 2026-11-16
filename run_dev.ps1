# BeverageTrack AI - Local Development Starter Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting BeverageTrack AI Platform (Freetown, Sierra Leone)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start FastAPI Backend on port 8000
Write-Host "Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$backendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "`$env:PYTHONPATH='backend'; backend\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" -PassThru

# Wait 2 seconds for backend to start
Start-Sleep -Seconds 2

# 2. Start Vite Frontend on port 3000
Write-Host "Starting Frontend on http://localhost:3000..." -ForegroundColor Yellow
$frontendJob = Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev -- --port 3000" -PassThru

Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
Write-Host "BeverageTrack AI is live!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "Backend:   http://localhost:8000" -ForegroundColor White
Write-Host "API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
