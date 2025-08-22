package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import com.rihal.AppointmentScheduler.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public AppointmentController(AppointmentService appointmentService, 
                               AppointmentRepository appointmentRepository,
                               UserRepository userRepository) {
        this.appointmentService = appointmentService;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerAppointments(@PathVariable String customerId) {
        try {
            // Convert string customerId to UUID
            UUID customerUuid = UUID.fromString(customerId);
            List<Appointment> appointments = appointmentRepository.findByCustomerId(customerUuid);
            
            List<Map<String, Object>> response = appointments.stream()
                .map(appt -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", appt.getId().toString());
                    map.put("date", appt.getDate());
                    map.put("startTime", appt.getStartTime());
                    map.put("endTime", appt.getEndTime());
                    map.put("status", appt.getStatus().name());
                    map.put("serviceType", appt.getServiceType() != null ? appt.getServiceType() : "Consultation");
                    map.put("notes", appt.getNotes() != null ? appt.getNotes() : "");
                    map.put("customerName", appt.getCustomerName());
                    map.put("customerPhone", appt.getCustomerPhone());
                    return map;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<?> getProviderAppointments(@PathVariable String providerId) {
        try {
            UUID providerUuid = UUID.fromString(providerId);
            List<Appointment> appointments = appointmentRepository.findByProviderId(providerUuid);
            
            List<Map<String, Object>> response = appointments.stream()
                .map(appt -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", appt.getId().toString());
                    map.put("date", appt.getDate());
                    map.put("startTime", appt.getStartTime());
                    map.put("endTime", appt.getEndTime());
                    map.put("status", appt.getStatus().name());
                    map.put("serviceType", appt.getServiceType() != null ? appt.getServiceType() : "Consultation");
                    map.put("notes", appt.getNotes() != null ? appt.getNotes() : "");
                    map.put("customerName", appt.getCustomerName());
                    map.put("customerPhone", appt.getCustomerPhone());
                    return map;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(List.of());
        }
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable String id, Authentication authentication) {
        try {
            UUID appointmentId = UUID.fromString(id);
            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
            // Check if user is authorized to cancel this appointment
            if (!user.getRole().equals(User.Role.ADMIN) && 
                !appointment.getCustomerId().equals(UUID.fromString("00000000-0000-0000-0000-" + String.format("%012d", user.getId()))) &&
                !appointment.getProviderId().equals(UUID.fromString("00000000-0000-0000-0000-" + String.format("%012d", user.getId())))) {
                Map<String, String> errorMap = new java.util.HashMap<>();
                errorMap.put("error", "Not authorized to cancel this appointment");
                return ResponseEntity.status(403).body(errorMap);
            }
            
            appointment.setStatus(Appointment.Status.CANCELLED);
            appointmentRepository.save(appointment);
            
            Map<String, String> successMap = new java.util.HashMap<>();
            successMap.put("message", "Appointment cancelled successfully");
            return ResponseEntity.ok(successMap);
        } catch (Exception e) {
            Map<String, String> errorMap = new java.util.HashMap<>();
            errorMap.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorMap);
        }
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }
}
