@echo off
echo Building and pushing to Docker Hub...
echo.

set /p USERNAME="Enter Docker Hub username: "
set /p TAG="Enter tag (e.g., v1.0.0): "

echo.
echo Building image...
docker build -t %USERNAME%/appointment-scheduler:%TAG% .
docker build -t %USERNAME%/appointment-scheduler:latest .

echo.
echo Logging in to Docker Hub...
docker login

echo.
echo Pushing images...
docker push %USERNAME%/appointment-scheduler:%TAG%
docker push %USERNAME%/appointment-scheduler:latest

echo.
echo Done! Images pushed to Docker Hub.
echo.
echo To run: docker run -p 8080:8080 -e DB_HOST=your_host -e DB_PASSWORD=your_pass %USERNAME%/appointment-scheduler:latest
pause

