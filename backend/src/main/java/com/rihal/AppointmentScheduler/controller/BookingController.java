package com.rihal.AppointmentScheduler.controller;


import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.service.BookingService;
import com.rihal.AppointmentScheduler.service.SlotService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService bookingService;
    private final SlotService slotService;

    public BookingController(BookingService bookingService, SlotService slotService) {
        this.bookingService = bookingService;
        this.slotService = slotService;
    }

    @GetMapping("/slots")
    public Map<String,Object> getSlots(@RequestParam UUID providerId, @RequestParam String date) {
        LocalDate d = LocalDate.parse(date);
        return Map.of(
                "date", d.toString(),
                "slots", slotService.getSlots(providerId, d),
                "durationMinutes", 30
        );
    }

    @PostMapping("/appointments")
    public Appointment createBooking(@RequestBody Map<String,String> req) {
        UUID customerId = UUID.fromString(req.get("customerId"));
        UUID providerId = UUID.fromString(req.get("providerId"));
        LocalDate date = LocalDate.parse(req.get("date"));
        LocalTime startTime = LocalTime.parse(req.get("startTime"));
        return bookingService.book(customerId, providerId, date, startTime);
    }

    @PostMapping("/appointments/{id}/cancel")
    public Map<String,String> cancelBooking(@PathVariable UUID id) {
        bookingService.cancel(id);
        return Map.of("status", "CANCELLED");
    }
}

