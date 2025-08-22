package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.dto.BookingRequest;
import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.service.BookingService;
import com.rihal.AppointmentScheduler.service.SlotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final SlotService slotService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, SlotService slotService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.slotService = slotService;
        this.userRepository = userRepository;
    }

    @GetMapping("/slots")
    public ResponseEntity<List<java.time.LocalTime>> getSlots(@RequestParam UUID providerId,
                                                              @RequestParam LocalDate date) {
        return ResponseEntity.ok(slotService.getSlots(providerId, date));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request, Authentication authentication) {
        try {
            // Get customer ID from authenticated user
            String userEmail = authentication.getName();
            User customer = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Convert Long user ID to UUID for consistency with Appointment entity
            UUID customerId = UUID.fromString("00000000-0000-0000-0000-" + String.format("%012d", customer.getId()));
            
            bookingService.createBooking(
                customerId, 
                request.getProviderId(), 
                request.getDate(), 
                request.getStartTime(),
                request.getCustomerName(),
                request.getCustomerPhone(),
                request.getServiceType(),
                request.getNotes()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Booking created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
