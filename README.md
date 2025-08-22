# 📅 Appointment Scheduler

A modern, full-stack appointment scheduling application built with React, Spring Boot, and Docker. Features role-based access control, real-time availability management, and a responsive design with theme switching and localization support.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with Spring Security
- **👥 Role-Based Access**: Customer and Service Provider roles with different dashboards
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🌙 Theme Switching**: Dark/Light mode with CSS variables
- **🌍 Localization**: English and Arabic support with RTL layout
- **📅 Appointment Management**: Book, reschedule, and manage appointments
- **⏰ Availability Management**: Service providers can set working hours and breaks
- **🐳 Docker Ready**: Containerized for easy deployment
- **🚂 Railway Deployable**: Ready for cloud deployment

## 🏗️ Architecture

- **Frontend**: React 18 with Redux Toolkit, Vite, CSS Variables
- **Backend**: Spring Boot 3 with Spring Security, JPA, MySQL
- **Database**: MySQL 8.0 with JPA/Hibernate
- **Authentication**: JWT tokens with password hashing
- **Containerization**: Multi-stage Docker builds with Nginx
- **Deployment**: Railway-ready with Docker Compose for local development

## 🚀 Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Java 17](https://adoptium.net/) (for backend development)
- [Node.js 18+](https://nodejs.org/) (for frontend development)
- [pnpm](https://pnpm.io/) package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AppointmentScheduler
   ```

2. **Start with Docker (Recommended)**
   ```bash
   # Windows
   start-local.bat
   
   # Linux/Mac
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - Database: localhost:3306

### Manual Setup

1. **Backend Setup**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```

## 🐳 Docker Deployment

### Local Docker Compose

```bash
# Start all services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Railway Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy using script**
   ```bash
   # Windows
   deploy.bat
   
   # Linux/Mac
   ./deploy.sh
   ```

3. **Manual deployment**
   ```bash
   railway login
   railway up
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🔧 Configuration

### Environment Variables

#### Backend
- `SPRING_PROFILES_ACTIVE`: Spring profile (dev, docker, prod)
- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRATION`: JWT expiration time

#### Frontend
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENVIRONMENT`: Environment name
- `REACT_APP_ENABLE_DEBUG`: Enable debug mode

### Database Configuration

The application uses MySQL with the following default settings:
- Database: `appointment_scheduler`
- Username: `appointment_user`
- Password: `appointment_pass`
- Port: `3306`

## 📱 User Roles & Features

### 👤 Customer
- Browse available services
- Book appointments with providers
- View appointment history
- Manage personal profile

### 🏥 Service Provider
- Set working hours and availability
- View and manage bookings
- Update service information
- Access provider dashboard

### 👨‍💼 Admin
- Manage all users and services
- Monitor system statistics
- Handle system-wide configurations
- Access admin dashboard

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on all devices
- **Theme Switching**: Toggle between light and dark themes
- **Language Support**: English and Arabic with RTL support
- **Modern Components**: Built with modern React patterns
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Performance**: Optimized with lazy loading and code splitting

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt password encryption
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: JPA/Hibernate parameterized queries
- **XSS Protection**: Content Security Policy headers

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Delete appointment

### Availability
- `GET /api/availability` - Get provider availability
- `POST /api/availability` - Set provider availability
- `PUT /api/availability/{id}` - Update availability

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/providers` - List service providers

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
pnpm test
```

### E2E Testing
```bash
# Start the application
docker-compose up --build

# Run E2E tests
pnpm run test:e2e
```

## 📈 Performance & Monitoring

- **Health Checks**: Built-in health endpoints for monitoring
- **Metrics**: Prometheus metrics export
- **Logging**: Structured logging with configurable levels
- **Caching**: Redis integration for performance optimization
- **Database Optimization**: Connection pooling and query optimization

## 🔄 CI/CD

### GitHub Actions
Automated deployment pipeline with:
- Code quality checks
- Automated testing
- Docker image building
- Railway deployment

### Railway Integration
- Automatic scaling
- Health monitoring
- Log aggregation
- Environment management

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Check if ports 80, 8080, 3306 are available
   - Modify docker-compose.yml if needed

2. **Database Connection**
   - Verify MySQL service is running
   - Check database credentials
   - Ensure network connectivity

3. **Build Failures**
   - Verify Java 17 and Node.js 18+ are installed
   - Check Maven and pnpm installations
   - Review error logs for specific issues

### Debug Commands

```bash
# Check Docker containers
docker ps -a

# View service logs
docker-compose logs [service-name]

# Check Railway status
railway status

# View Railway logs
railway logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the frontend framework
- [Spring Boot](https://spring.io/projects/spring-boot) for the backend framework
- [Docker](https://www.docker.com/) for containerization
- [Railway](https://railway.app/) for deployment platform
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Email**: support@yourdomain.com

---

**Made with ❤️ for better appointment scheduling**
