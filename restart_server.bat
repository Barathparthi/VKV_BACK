@echo off
echo Killing all Node.js processes...
taskkill /F /IM node.exe
timeout /t 2
echo.
echo Starting backend server...
cd /d "%~dp0"
npm run dev
