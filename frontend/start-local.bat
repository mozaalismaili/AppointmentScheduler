@echo off
echo Starting Frontend locally...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev

pause
