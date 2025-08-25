@echo off
echo Setting up environment variables for AppointmentScheduler...
echo.

if exist .env (
    echo .env file already exists. Do you want to overwrite it? (y/N)
    set /p choice=
    if /i "%choice%"=="y" (
        echo Overwriting .env file...
    ) else (
        echo Setup cancelled.
        exit /b 0
    )
)

echo Copying env.example to .env...
copy env.example .env

if exist .env (
    echo.
    echo Environment file created successfully!
    echo.
    echo Please edit .env file with your actual values:
    echo - Update database credentials
    echo - Adjust appointment settings if needed
    echo - Modify server port if required
    echo.
    echo After editing, restart your application.
) else (
    echo.
    echo Error: Failed to create .env file.
    echo Please manually copy env.example to .env
)

echo.
pause

