@echo off
REM Appointment Scheduler Production Deployment Script for Windows
REM This script builds and deploys the application to Railway

echo 🚀 Starting production deployment process...

REM Check if Railway CLI is installed
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Railway CLI is not installed. Please install it first:
    echo npm install -g @railway/cli
    pause
    exit /b 1
)
echo [SUCCESS] Railway CLI found

REM Build backend
echo [INFO] Building backend...
cd backend
call mvnw clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed
    pause
    exit /b 1
)
echo [SUCCESS] Backend built successfully
cd ..

REM Build frontend
echo [INFO] Building frontend...
cd frontend
call pnpm install --frozen-lockfile
if %errorlevel% neq 0 (
    echo [ERROR] Frontend dependencies installation failed
    pause
    exit /b 1
)

call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed
    pause
    exit /b 1
)
echo [SUCCESS] Frontend built successfully
cd ..

REM Deploy to Railway
echo [INFO] Deploying to Railway...

REM Login to Railway (if not already logged in)
railway whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Logging in to Railway...
    railway login
)

REM Deploy
railway up
if %errorlevel% neq 0 (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo [SUCCESS] 🎉 Production deployment completed successfully!
echo [INFO] Your application is now live on Railway!
echo [INFO] Make sure to set the REACT_APP_API_URL environment variable in Railway
echo [INFO] to point to your backend service URL
pause
