package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.dto.AvailabilityDTO;
import com.rihal.AppointmentScheduler.service.AvailabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "*")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<AvailabilityDTO>> getAllAvailabilitiesByProvider(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "false") boolean activeOnly) {

        List<AvailabilityDTO> availabilities;
        if (activeOnly) {
            availabilities = availabilityService.getActiveAvailabilitiesByProvider(providerId);
        } else {
            availabilities = availabilityService.getAllAvailabilitiesByProvider(providerId);
        }

        return ResponseEntity.ok(availabilities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AvailabilityDTO> getAvailabilityById(@PathVariable Long id) {
        AvailabilityDTO availability = availabilityService.getAvailabilityById(id);
        return ResponseEntity.ok(availability);
    }

    @PostMapping
    public ResponseEntity<AvailabilityDTO> createAvailability(@Valid @RequestBody AvailabilityDTO availabilityDTO) {
        try {
            AvailabilityDTO createdAvailability = availabilityService.createAvailability(availabilityDTO);
            return new ResponseEntity<>(createdAvailability, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AvailabilityDTO> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityDTO availabilityDTO) {
        try {
            AvailabilityDTO updatedAvailability = availabilityService.updateAvailability(id, availabilityDTO);
            return ResponseEntity.ok(updatedAvailability);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<AvailabilityDTO> toggleAvailabilityStatus(@PathVariable Long id) {
        AvailabilityDTO availability = availabilityService.toggleAvailabilityStatus(id);
        return ResponseEntity.ok(availability);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
    }
}