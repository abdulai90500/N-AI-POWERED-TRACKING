@echo off
echo ==========================================================
echo  Starting BeverageTrack AI Platform (Freetown, Sierra Leone)
echo ==========================================================

start "BeverageTrack AI Backend" cmd /k "set PYTHONPATH=backend && backend\venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak >nul
start "BeverageTrack AI Frontend" cmd /k "cd frontend && npm run dev -- --port 3000"

echo.
echo BeverageTrack AI is starting!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Swagger:  http://localhost:8000/docs
echo ==========================================================
