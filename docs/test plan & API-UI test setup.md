Here's a clean **README.md** version of your Week 1 Test Plan & Setup:

---

# 📋 Week 1 Test Plan & API/UI Test Setup

**Project 5: Appointment Scheduler**

---

## 🎯 Purpose

This document defines the **test plan** and **test setup** for **Week 1** of the Appointment Scheduler project.
It covers API tests, UI tests, and CI/CD integration for the following features:

* Authentication & roles (JWT, Spring Security)
* Role-based access control
* User Management API (signup/login, profile fields)
* Availability API (CRUD for provider schedules & holidays)
* Booking API (slot availability, transaction locks)
* Auth & Booking UI (login/signup, availability form, booking calendar)

---

## 📌 1. Scope of Testing

✅ **In Scope (Week 1):**

* Authentication → Secure JWT login/logout with role-based access
* User Management → Signup, login, profile retrieval
* Availability Management → Provider schedule & holidays (CRUD)
* Booking Flow → Customer books appointment in free slot, prevent double-booking
* Frontend UI → Login, signup, provider availability form, booking UI

❌ **Out of Scope (Week 1, tested in Week 2+):**

* Cancel/reschedule flows
* Notifications
* Dashboards

---

## 📌 2. Testing Objectives

1. Verify secure authentication and role enforcement.
2. Ensure providers can define and update availability.
3. Ensure customers can only book from available slots.
4. Prevent double-booking using DB transaction locks.
5. Validate UI flows for login, availability, and booking.

---

## 📌 3. Types of Testing

* **Unit Tests** → JUnit + Mockito (backend services & repositories)
* **API Tests** → Postman/Newman & Spring Boot integration tests
* **UI Tests** → Cypress (React flows)
* **Integration Tests** → End-to-end booking flow
* **Security Tests** → Role-based access control

---

## 📌 4. Test Setup

### 🔹 API Testing Setup

1. Tool: Postman or Newman CLI
2. Import collection: `/tests/api/AppointmentScheduler.postman_collection.json`
3. Configure environment variables:

   ```json
   {
     "BASE_URL": "http://localhost:8080/api",
     "AUTH_TOKEN": ""
   }
   ```

**Example API Tests:**

* `POST /auth/signup` → create user
* `POST /auth/login` → return JWT token
* `GET /availability/provider/{id}` → fetch provider slots
* `POST /availability` → provider adds availability
* `POST /appointments/book` → book slot, enforce transaction lock

---

### 🔹 UI Testing Setup

Tool: **Cypress**

Install & open Cypress:

```bash
npm install cypress --save-dev
npx cypress open
```

**Example Cypress Specs:**

* ✅ Login flow (`/login` → redirect to dashboard)
* ✅ Role-based routing (`/provider-dashboard` blocked for customers)
* ✅ Provider sets availability (form → DB update verified)
* ✅ Customer books appointment (calendar → booking success message)

---

### 🔹 Backend Unit Testing

Framework: **JUnit + Mockito**

**Coverage Goals:**

* AuthService (JWT issue, validation)
* UserService (signup, duplicate email rejection)
* AvailabilityService (CRUD, holidays)
* BookingService (slot validation, transaction lock)

---

## 📌 5. Test Scenarios

### 🔑 Authentication & Roles

* Customer can sign up & login
* Provider/Admin can sign up & login
* Wrong password → `401 Unauthorized`
* Customer blocked from provider-only endpoints

### 👤 User Management

* Customer profile includes name, email, phone
* Provider profile includes service name, working hours
* Duplicate email signup → rejected

### 📅 Availability API

* Provider can create, update, delete availability
* Provider can mark holidays/unavailable dates
* Availability retrieval returns correct slots

### 📖 Booking API

* Customer books only available slot
* Double booking attempt → one succeeds, one fails
* Appointment saved with `status = booked`

### 🖥️ UI Tests

* Login redirects by role (customer/provider)
* Provider form saves availability → persists in DB
* Customer calendar shows available slots
* Booking confirmation updates appointment list

---

## 📌 6. Test Data

**Users**

* Customer → `customer1@test.com / pass123`
* Provider → `provider1@test.com / pass123`

**Availability**

* Mon–Fri, 09:00–17:00, slot duration = 30 min

**Booking Example**

* Customer books slot: `2025-08-20 10:00`

---

## 📌 7. CI/CD Integration

**Backend Tests:**

* Run JUnit + Newman in pipeline
* Fail build on test failure

**Frontend Tests:**
Run Cypress headless:

```bash
npx cypress run
```

**Dockerized Tests:**

```bash
docker-compose -f docker-compose.test.yml up --build --exit-code-from test
```

---

## 📌 8. Deliverables (Week 1)

* ✅ Postman collection → `/tests/api/AppointmentScheduler.postman_collection.json`
* ✅ Cypress test suite → `/tests/ui/cypress/`
* ✅ JUnit backend tests → `/src/test/java/...`
* ✅ Test cases doc → `/docs/test-plan-week1.md`
* ✅ CI/CD pipeline → executes API + UI tests on PR merge

---

## 📌 9. Next Steps (Week 2)

* Extend tests to Cancel/Reschedule APIs
* Add Customer/Provider dashboards UI tests
* Validate calendar data grouping
* Conduct end-to-end functional testing

