package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.dto.HolidayDTO;
import com.rihal.AppointmentScheduler.service.HolidayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/holidays")
@CrossOrigin(origins = "*")
public class HolidayController {

    @Autowired
    private HolidayService holidayService;

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<HolidayDTO>> getAllHolidaysByProvider(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "false") boolean upcomingOnly) {

        List<HolidayDTO> holidays;
        if (upcomingOnly) {
            holidays = holidayService.getUpcomingHolidaysByProvider(providerId);
        } else {
            holidays = holidayService.getAllHolidaysByProvider(providerId);
        }

        return ResponseEntity.ok(holidays);
    }

    @GetMapping("/provider/{providerId}/range")
    public ResponseEntity<List<HolidayDTO>> getHolidaysByDateRange(
            @PathVariable Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<HolidayDTO> holidays = holidayService.getHolidaysByDateRange(providerId, startDate, endDate);
        return ResponseEntity.ok(holidays);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HolidayDTO> getHolidayById(@PathVariable Long id) {
        HolidayDTO holiday = holidayService.getHolidayById(id);
        return ResponseEntity.ok(holiday);
    }

    @PostMapping
    public ResponseEntity<HolidayDTO> createHoliday(@Valid @RequestBody HolidayDTO holidayDTO) {
        try {
            HolidayDTO createdHoliday = holidayService.createHoliday(holidayDTO);
            return new ResponseEntity<>(createdHoliday, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HolidayDTO> updateHoliday(
            @PathVariable Long id,
            @Valid @RequestBody HolidayDTO holidayDTO) {
        try {
            HolidayDTO updatedHoliday = holidayService.updateHoliday(id, holidayDTO);
            return ResponseEntity.ok(updatedHoliday);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHoliday(@PathVariable Long id) {
        holidayService.deleteHoliday(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/provider/{providerId}/check")
    public ResponseEntity<Boolean> isHoliday(
            @PathVariable Long providerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        boolean isHoliday = holidayService.isHoliday(providerId, date);
        return ResponseEntity.ok(isHoliday);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
    }
}
