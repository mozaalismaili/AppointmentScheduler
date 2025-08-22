@echo off
REM Appointment Scheduler Local Development Starter
REM This script starts the application locally using Docker Compose

echo 🐳 Starting Appointment Scheduler locally...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo [SUCCESS] Docker is running

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not available. Please install Docker Compose.
    pause
    exit /b 1
)
echo [SUCCESS] Docker Compose found

REM Build and start services
echo [INFO] Building and starting services...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start services
    pause
    exit /b 1
)

echo [SUCCESS] 🎉 Services started successfully!
echo.
echo 📱 Access your application at:
echo    Frontend: http://localhost:80
echo    Backend API: http://localhost:8080
echo    MySQL Database: localhost:3306
echo    Redis: localhost:6379
echo.
echo 📊 Monitor services:
echo    docker-compose ps
echo.
echo 📝 View logs:
echo    docker-compose logs -f
echo.
echo 🛑 Stop services:
echo    docker-compose down
echo.
pause
