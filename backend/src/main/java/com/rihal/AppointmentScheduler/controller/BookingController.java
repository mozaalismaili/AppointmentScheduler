package com.rihal.AppointmentScheduler.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rihal.AppointmentScheduler.service.BookingService;
import com.rihal.AppointmentScheduler.service.SlotService;

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

    // Note: Cancel endpoint has been moved to AppointmentController for consolidation
    // ... slots + createBooking remain same

    // Removed duplicate cancel endpoint - now handled by AppointmentController
}
