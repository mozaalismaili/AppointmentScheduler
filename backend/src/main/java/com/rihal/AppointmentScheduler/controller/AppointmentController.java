package com.rihal.AppointmentScheduler.controller;

import com.rihal.appointments.dto.AppointmentDTO;
import com.rihal.appointments.model.AppointmentStatus;
import com.rihal.appointments.service.AppointmentService;
import org.springframework.data.domain.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) { this.service = service; }

    @GetMapping("/customer/{customerId}")
    public Page<AppointmentDTO> customerAppointments(
            @PathVariable Long customerId,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime,asc") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
        return service.getForCustomer(customerId, status, from, to, pageable);
    }

    @GetMapping("/provider/{providerId}")
    public Page<AppointmentDTO> providerAppointments(
            @PathVariable Long providerId,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentTime,asc") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(parseSort(sort)));
        return service.getForProvider(providerId, status, from, to, pageable);
    }

    private Sort.Order parseSort(String s) {
        String[] parts = s.split(",");
        String prop = parts[0];
        boolean asc = parts.length < 2 || !"desc".equalsIgnoreCase(parts[1]);
        return asc ? Sort.Order.asc(prop) : Sort.Order.desc(prop);
    }
}
