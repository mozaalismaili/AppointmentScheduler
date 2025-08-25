@echo off
echo Starting Appointment Scheduler locally...
echo.

echo Building the application...
call mvn clean package -DskipTests

echo.
echo Starting the application...
java -jar target/AppointmentScheduler-0.0.1-SNAPSHOT.jar

pause
