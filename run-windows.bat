@echo off
setlocal
cd /d "%~dp0"

echo =======================================================
echo   BD Solar Energy — Starting in Separate Windows
echo =======================================================
echo.
echo [1/2] Starting Django REST Backend on http://127.0.0.1:8001...
start "BD Solar Backend (Django :8001)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8001"

echo [2/2] Starting React Vite Frontend on http://localhost:5173...
start "BD Solar Frontend (Vite :5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched in separate terminal windows!
echo - Storefront:  http://localhost:5173/
echo - Backend API: http://127.0.0.1:8001/api/v1/
echo - Admin:       http://127.0.0.1:8001/admin/
echo.
pause

