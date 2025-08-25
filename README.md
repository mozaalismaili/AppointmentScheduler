# Appointment Scheduler

A full-stack appointment scheduling application built with Spring Boot (Backend) and React (Frontend).

## Features

- User authentication and authorization
- Service provider availability management
- Appointment booking and management
- Calendar integration
- Real-time notifications
- Responsive design

## Tech Stack

### Backend

- **Java 21**
- **Spring Boot 3.5.4**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL** database
- **Maven**

### Frontend

- **React 19**
- **Vite** build tool
- **Redux Toolkit** for state management
- **React Query** for data fetching
- **React Hook Form** with Zod validation
- **Tailwind CSS** for styling

## Prerequisites

- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd AppointmentScheduler
```

### 2. Backend Setup

#### Environment Configuration

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Copy the environment example file:

   ```bash
   copy env.example .env
   ```

3. Edit `.env` file with your configuration:

   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=your_database_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

   # Other configurations...
   ```

#### Database Setup

1. Create a MySQL database with the name specified in your `.env` file
2. The application will automatically create tables on first run

#### Run the Backend

```bash
# Using Maven
mvn spring-boot:run

# Or using the provided script (Windows)
start-local.bat
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup

#### Environment Configuration

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Create a `.env` file if you need to override the default API endpoint:
   ```bash
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

#### Install Dependencies

```bash
npm install
# or
pnpm install
```

#### Run the Frontend

```bash
# Development mode
npm run dev

# Or using the provided script (Windows)
start-local.bat
```

The frontend will be available at `http://localhost:5173`

### 4. Docker Setup (Alternative)

You can also run the entire application using Docker:

```bash
cd backend
docker-compose -f docker-compose.local.yml up --build
```

## API Documentation

The API documentation is available in the `docs/` folder:

- [API Documentation](docs/API_Documentation.md)
- [Test Plan & API-UI Test Setup](docs/test%20plan%20&%20API-UI%20test%20setup.md)

## Project Structure

```
AppointmentScheduler/
├── backend/                 # Spring Boot application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── pom.xml            # Maven dependencies
├── frontend/               # React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
└── docs/                  # Documentation
```

## Security Considerations

- **JWT Secret**: Always use a strong, random JWT secret in production
- **Database Credentials**: Never commit real database credentials to version control
- **Environment Variables**: Use environment variables for all sensitive configuration
- **CORS**: Configure CORS origins appropriately for your deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please create an issue in the repository.
