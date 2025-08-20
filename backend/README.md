# Appointment Scheduler API

A robust Spring Boot API for managing appointments with advanced time-limit validation and security features.

## 🚀 Features

- **Secure Authentication**: BCrypt password hashing with Spring Security
- **Time-Limit Validation**: 24-hour cancellation limit with 15-minute grace period
- **Role-Based Access**: Customer, Provider, and Admin roles
- **Comprehensive API**: Full CRUD operations for appointments, availability, and holidays
- **Database Integration**: MySQL with JPA/Hibernate
- **Input Validation**: Jakarta validation with custom business rules

## 🛠️ Technology Stack

- **Java 21**
- **Spring Boot 3.5.4**
- **Spring Security**
- **Spring Data JPA**
- **MySQL Database**
- **Maven**

## 📋 Prerequisites

- Java 21 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

## 🚀 Quick Start

### 1. Database Setup

```sql
CREATE DATABASE appointment_system;
```

### 2. Configuration

Update `src/main/resources/application.properties` with your database credentials:

```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Application

```bash
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login        |

### 📅 Appointments

| Method | Endpoint                                  | Description                                         |
| ------ | ----------------------------------------- | --------------------------------------------------- |
| GET    | `/api/appointments/{id}`                  | Get appointment by ID                               |
| DELETE | `/api/appointments/{id}/cancel`           | **Cancel appointment (with time-limit validation)** |
| GET    | `/api/appointments/customer/{customerId}` | Get appointments by customer                        |
| GET    | `/api/appointments/provider/{providerId}` | Get appointments by provider                        |

### ⏰ Availability

| Method | Endpoint                                  | Description               |
| ------ | ----------------------------------------- | ------------------------- |
| GET    | `/api/availability/provider/{providerId}` | Get provider availability |
| POST   | `/api/availability`                       | Create availability       |
| PUT    | `/api/availability/{id}`                  | Update availability       |
| DELETE | `/api/availability/{id}`                  | Delete availability       |

### 🏖️ Holidays

| Method | Endpoint                              | Description           |
| ------ | ------------------------------------- | --------------------- |
| GET    | `/api/holidays/provider/{providerId}` | Get provider holidays |
| POST   | `/api/holidays`                       | Create holiday        |
| PUT    | `/api/holidays/{id}`                  | Update holiday        |
| DELETE | `/api/holidays/{id}`                  | Delete holiday        |

### 👥 Users

| Method | Endpoint     | Description |
| ------ | ------------ | ----------- |
| POST   | `/api/users` | Create user |

### 🧪 Testing

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | `/api/test/endpoints` | View all API endpoints |
| GET    | `/api/test/health`    | Health check           |

## 🔒 Security Features

### Password Security

- **BCrypt hashing** for all passwords
- **No plain text** passwords stored in database
- **Secure validation** during login

### Authentication

- **Spring Security** integration
- **JWT-ready** architecture
- **Role-based** access control

### Input Validation

- **Jakarta validation** annotations
- **Custom business rules** for appointments
- **SQL injection** protection

## ⏱️ Time-Limit Validation

### Cancellation Rules

- **Default limit**: 24 hours before appointment
- **Grace period**: 15 minutes additional flexibility
- **Past appointments**: Cannot be cancelled
- **Provider override**: Admins and providers can bypass limits

### Example Scenarios

```
Appointment: Tomorrow at 2:00 PM
Current time: Today at 1:00 PM
Time until appointment: 25 hours
Result: ✅ CANCEL ALLOWED

Appointment: Tomorrow at 2:00 PM
Current time: Today at 2:00 PM (24 hours before)
Result: ❌ CANCEL DENIED (within limit)

Appointment: Tomorrow at 2:00 PM
Current time: Today at 1:45 PM (24 hours 15 minutes before)
Result: ✅ CANCEL ALLOWED (grace period)
```

## 🧪 Testing the API

### 1. Health Check

```bash
curl http://localhost:8080/api/test/health
```

### 2. View All Endpoints

```bash
curl http://localhost:8080/api/test/endpoints
```

### 3. Register a User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "CUSTOMER",
    "phone": "1234567890"
  }'
```

### 4. Test Availability Endpoint

```bash
curl http://localhost:8080/api/availability/provider/1
```

## 🔧 Configuration

### Appointment Settings

```properties
# Cancellation limit (hours)
appointment.default-cancellation-limit-hours=24

# Grace period (minutes)
appointment.grace-period-minutes=15

# Allow past cancellations
appointment.allow-past-cancellations=false
```

### Database Settings

```properties
# Database URL
spring.datasource.url=jdbc:mysql://localhost:3306/appointment_system

# JPA Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 🚨 Important Notes

### Security

- **Never expose** database credentials in production
- **Use environment variables** for sensitive data
- **Enable HTTPS** in production environments

### Time Validation

- **Timezone aware**: All times are in server timezone
- **Configurable limits**: Can be adjusted per provider
- **Grace periods**: Built-in flexibility for edge cases

### Database

- **Auto-creation**: Database and tables created automatically
- **Data persistence**: All changes are saved immediately
- **Transaction safety**: All operations are transactional

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**

   - Check MySQL service is running
   - Verify credentials in `application.properties`
   - Ensure database exists

2. **Port Already in Use**

   - Change port in `application.properties`
   - Kill process using port 8080

3. **Validation Errors**
   - Check request body format
   - Verify required fields are present
   - Ensure data types are correct

### Logs

Enable debug logging by adding to `application.properties`:

```properties
logging.level.com.rihal.AppointmentScheduler=DEBUG
```

## 📈 Future Enhancements

- [ ] JWT token authentication
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Calendar integration
- [ ] Payment processing
- [ ] Advanced reporting
- [ ] Mobile app support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

