# AppointmentScheduler
Web application that allows customers to book, cancel, and view appointments with a service provider.

##Repository Structure (after Week 1)
appointment-scheduler/
│
├── backend/
│   ├── src/main/java/com/project/
│   │   ├── config/            # Security config, JWT setup
│   │   ├── controller/        # AuthController, AvailabilityController, BookingController
│   │   ├── model/             # JPA Entities: User, Availability, Appointment
│   │   ├── repository/        # JPA Repositories
│   │   ├── service/           # AuthService, AvailabilityService, BookingService
│   │   └── Application.java   # Main Spring Boot app
│   │
│   ├── src/main/resources/
│   │   ├── application.properties  # DB connection, server port
│   │   └── schema.sql              # Optional DB schema
│   │
│   └── pom.xml / build.gradle      # Dependencies
│
├── frontend/
│   ├── public/                     # Static files
│   ├── src/
│   │   ├── components/             # LoginForm, AvailabilityForm, BookingForm
│   │   ├── pages/                   # LoginPage, ProviderDashboard, CustomerDashboard
│   │   ├── services/                # API calls (auth, availability, booking)
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json                 # Dependencies
│   └── README.md
│
├── docs/
│   ├── API_Documentation.md         # Endpoints description
│   ├── Test_Cases.md                # QA scenarios
│   └── Project_Overview.md
│
├── postman_collection.json          # For API testing
├── README.md                        # Project setup + usage
└── .gitignore


##Expected Functionality by End of Week 1

###Backend
Working Auth API with signup/login (roles: Customer, Provider).
Availability API to set and fetch provider’s available slots.
Database tables & JPA entities (users, availability, appointments) created.

###Frontend
Login page (works with backend).
Availability form (UI + connected to API).
Basic booking page UI (slots displayed, booking form functional).

###QA/Docs
Postman collection for Auth & Availability.
Test case document for Week 1 features.
README explaining setup & run instructions.
