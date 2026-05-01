@echo off
echo ========================================
echo     Starting StudySync Application
echo ========================================
echo.

start "StudySync Backend" cmd /k "cd /d %~dp0server && npm run dev"
timeout /t 3 /nobreak > nul
start "StudySync Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ✅ Both servers are starting...
echo    Backend  → http://localhost:5000
echo    Frontend → http://localhost:3000
echo.
timeout /t 5 /nobreak > nul
start "" http://localhost:3000
