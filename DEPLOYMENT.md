# 🚀 Appointment Scheduler - Production Deployment Guide

This guide will help you deploy the Appointment Scheduler application to Railway using Docker containers with production-ready backend authentication.

## 📋 Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Railway CLI](https://docs.railway.app/develop/cli) installed
- [Git](https://git-scm.com/) for version control
- [Java 17](https://adoptium.net/) for backend development
- [Node.js 18+](https://nodejs.org/) for frontend development
- [pnpm](https://pnpm.io/) package manager

## 🏗️ Project Structure

```
AppointmentScheduler/
├── backend/                 # Spring Boot Backend
│   ├── Dockerfile          # Backend Docker configuration
│   ├── .dockerignore       # Backend Docker ignore rules
│   └── src/                # Java source code
├── frontend/               # React Frontend
│   ├── Dockerfile          # Frontend Docker configuration
│   ├── .dockerignore       # Frontend Docker ignore rules
│   ├── nginx.conf          # Nginx configuration
│   └── src/                # React source code
├── docker-compose.yml      # Local development setup
├── railway.toml            # Railway deployment configuration
├── deploy.bat              # Production deployment script
└── DEPLOYMENT.md           # This file
```

## 🐳 Local Development with Docker

### 1. Start the entire stack locally

```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 2. Access the application

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8080
- **MySQL Database**: localhost:3306
- **Redis**: localhost:6379

### 3. Stop the services

```bash
docker-compose down

# Remove volumes (database data)
docker-compose down -v
```

## 🚂 Railway Production Deployment

### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Login to Railway

```bash
railway login
```

### 3. Initialize Railway project

```bash
railway init
```

### 4. Set environment variables

```bash
# Backend environment variables
railway variables set JWT_SECRET="your-super-secret-jwt-key"
railway variables set DATABASE_URL="your-mysql-connection-string"
railway variables set DATABASE_USERNAME="your-db-username"
railway variables set DATABASE_PASSWORD="your-db-password"

# Frontend environment variables
railway variables set REACT_APP_API_URL="https://your-backend-domain.com/api"
```

### 5. Deploy using the script

```bash
# Run deployment (Windows)
deploy.bat

# Or run deployment (Linux/Mac)
chmod +x deploy.sh
./deploy.sh
```

### 6. Manual deployment

```bash
# Deploy backend
cd backend
railway up

# Deploy frontend
cd frontend
railway up
```

## 🔧 Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` |
| `DATABASE_URL` | MySQL connection string | Required |
| `DATABASE_USERNAME` | Database username | Required |
| `DATABASE_PASSWORD` | Database password | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRATION` | JWT expiration time | `86400000` |
| `PORT` | Server port | `8080` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | Required |
| `REACT_APP_ENVIRONMENT` | Environment name | `production` |
| `REACT_APP_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `REACT_APP_ENABLE_DEBUG` | Enable debug mode | `false` |

## 📊 Health Checks

### Backend Health Check
- **Endpoint**: `/actuator/health`
- **Expected Response**: `{"status":"UP"}`

### Frontend Health Check
- **Endpoint**: `/health`
- **Expected Response**: `healthy`

## 🔍 Monitoring and Logs

### View Railway logs

```bash
# Backend logs
railway logs --service appointment-scheduler-backend

# Frontend logs
railway logs --service appointment-scheduler-frontend
```

### Monitor application health

```bash
# Check service status
railway status

# View service details
railway service
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Dockerfile syntax
   - Verify all required files are present
   - Check .dockerignore exclusions

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database credentials
   - Ensure database is accessible

3. **Frontend API Calls Failing**
   - Verify REACT_APP_API_URL is correct
   - Check CORS configuration
   - Ensure backend is running

4. **Port Conflicts**
   - Check if ports are already in use
   - Modify docker-compose.yml if needed
   - Use different ports for local development

### Debug Commands

```bash
# Check Docker containers
docker ps -a

# View container logs
docker logs <container_name>

# Execute commands in container
docker exec -it <container_name> /bin/bash

# Check Railway service status
railway status
```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Railway secrets for sensitive values
   - Rotate JWT secrets regularly

2. **Database Security**
   - Use strong passwords
   - Limit database access
   - Enable SSL connections in production

3. **API Security**
   - Implement rate limiting
   - Use HTTPS in production
   - Validate all inputs

## 📈 Scaling

### Railway Auto-scaling

Railway automatically scales your application based on:
- CPU usage
- Memory usage
- Request volume

### Manual Scaling

```bash
# Scale backend service
railway scale --service appointment-scheduler-backend --count 3

# Scale frontend service
railway scale --service appointment-scheduler-frontend --count 2
```

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g @railway/cli
      - run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 📞 Support

- **Railway Documentation**: https://docs.railway.app/
- **Docker Documentation**: https://docs.docker.com/
- **Spring Boot Documentation**: https://spring.io/projects/spring-boot
- **React Documentation**: https://reactjs.org/docs/

## 🎯 Next Steps

1. **Set up monitoring** with Railway's built-in tools
2. **Configure custom domains** for your services
3. **Set up automated backups** for your database
4. **Implement CI/CD pipeline** for automated deployments
5. **Add performance monitoring** and alerting

---

**Happy Deploying! 🚀**
