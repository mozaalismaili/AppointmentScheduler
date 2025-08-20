package com.rihal.AppointmentScheduler.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping("/endpoints")
    public Map<String, Object> getApiEndpoints() {
        return Map.of(
            "message", "Appointment Scheduler API Endpoints",
            "version", "1.0.0",
            "endpoints", Map.of(
                "Authentication", Map.of(
                    "POST /api/auth/register", "Register new user",
                    "POST /api/auth/login", "User login"
                ),
                "Appointments", Map.of(
                    "GET /api/appointments/{id}", "Get appointment by ID",
                    "DELETE /api/appointments/{id}/cancel", "Cancel appointment (with time-limit validation)",
                    "GET /api/appointments/customer/{customerId}", "Get appointments by customer",
                    "GET /api/appointments/provider/{providerId}", "Get appointments by provider"
                ),
                "Availability", Map.of(
                    "GET /api/availability/provider/{providerId}", "Get provider availability",
                    "POST /api/availability", "Create availability",
                    "PUT /api/availability/{id}", "Update availability",
                    "DELETE /api/availability/{id}", "Delete availability"
                ),
                "Holidays", Map.of(
                    "GET /api/holidays/provider/{providerId}", "Get provider holidays",
                    "POST /api/holidays", "Create holiday",
                    "PUT /api/holidays/{id}", "Update holiday",
                    "DELETE /api/holidays/{id}", "Delete holiday"
                ),
                "Users", Map.of(
                    "POST /api/users", "Create user"
                )
            ),
            "features", Map.of(
                "Security", "Spring Security with BCrypt password hashing",
                "Time Validation", "24-hour cancellation limit with 15-minute grace period",
                "Database", "MySQL with JPA/Hibernate",
                "Validation", "Jakarta validation with custom business rules"
            )
        );
    }

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        return Map.of("status", "UP", "service", "Appointment Scheduler API");
    }
}