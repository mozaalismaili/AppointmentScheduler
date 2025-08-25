package com.rihal.AppointmentScheduler.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rihal.AppointmentScheduler.service.TimeSlotService;

@RestController
@RequestMapping("/api/timeslots")
@CrossOrigin(origins = "*")
public class TimeSlotController {
    
    @Autowired
    private TimeSlotService timeSlotService;
    
    // Get available time slots for a specific date and provider
    @GetMapping("/available")
    public ResponseEntity<List<String>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam Long providerId,
            @RequestParam(defaultValue = "30") Integer serviceDurationMinutes) {
        
        try {
            List<String> availableSlots = timeSlotService.getAvailableSlotStrings(
                date, providerId, serviceDurationMinutes);
            return ResponseEntity.ok(availableSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
