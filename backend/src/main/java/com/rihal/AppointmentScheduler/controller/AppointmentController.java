package com.rihal.AppointmentScheduler.controller;

import com.rihal.appointments.dto.AppointmentDTO;
import com.rihal.appointments.model.AppointmentStatus;
import com.rihal.appointments.service.AppointmentService;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ✅ Cancel appointment
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable UUID id,
            Authentication authentication) {
        try {
            UUID userId = UUID.fromString(authentication.getName());
            String result = appointmentService.cancelAppointment(id, userId);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Get appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointment(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(appointmentService.getAppointmentById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Customer appointments with pagination + filters
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> customerAppointments(
            @PathVariable UUID customerId,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime,asc") String sort
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
            Page<AppointmentDTO> result = appointmentService.getForCustomer(customerId, status, from, to, pageable);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Provider appointments with pagination + filters
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<?> providerAppointments(
            @PathVariable UUID providerId,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime,asc") String sort
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
            Page<AppointmentDTO> result = appointmentService.getForProvider(providerId, status, from, to, pageable);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Helper for sorting
    private Sort.Order parseSort(String s) {
        String[] parts = s.split(",");
        String prop = parts[0];
        boolean asc = parts.length < 2 || !"desc".equalsIgnoreCase(parts[1]);
        return asc ? Sort.Order.asc(prop) : Sort.Order.desc(prop);
    }
}
