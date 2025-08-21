package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.dto.CalendarResponse;
import com.rihal.AppointmentScheduler.dto.DayBucketDTO;
import com.rihal.AppointmentScheduler.dto.MonthBucketDTO;
import com.rihal.AppointmentScheduler.dto.WeekBucketDTO;
import com.rihal.AppointmentScheduler.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:5173")
public class CalendarController {

    private final CalendarService service;

    public CalendarController(CalendarService service) {
        this.service = service;
    }

    /**
     * Group by day
     * GET /api/calendar/provider/{providerId}/daily?start=2025-08-01&end=2025-08-31&includeCancelled=false
     */
    @GetMapping("/provider/{providerId}/daily")
    public ResponseEntity<CalendarResponse<DayBucketDTO>> byDay(@PathVariable UUID providerId,
                                                                @RequestParam String start,
                                                                @RequestParam String end,
                                                                @RequestParam(defaultValue = "false") boolean includeCancelled) {
        LocalDate s = LocalDate.parse(start);
        LocalDate e = LocalDate.parse(end);
        return ResponseEntity.ok(service.daily(providerId, s, e, includeCancelled));
    }

    /**
     * Group by week (ISO, Locale-aware)
     * GET /api/calendar/provider/{providerId}/weekly?start=2025-07-01&end=2025-08-31&includeCancelled=false&locale=en-US
     */
    @GetMapping("/provider/{providerId}/weekly")
    public ResponseEntity<CalendarResponse<WeekBucketDTO>> byWeek(@PathVariable UUID providerId,
                                                                  @RequestParam String start,
                                                                  @RequestParam String end,
                                                                  @RequestParam(defaultValue = "false") boolean includeCancelled,
                                                                  @RequestParam(defaultValue = "en-US") String locale) {
        LocalDate s = LocalDate.parse(start);
        LocalDate e = LocalDate.parse(end);
        Locale loc = Locale.forLanguageTag(locale);
        return ResponseEntity.ok(service.weekly(providerId, s, e, includeCancelled, loc));
    }

    /**
     * Group by month
     * GET /api/calendar/provider/{providerId}/monthly?start=2025-01-01&end=2025-12-31&includeCancelled=true
     */
    @GetMapping("/provider/{providerId}/monthly")
    public ResponseEntity<CalendarResponse<MonthBucketDTO>> byMonth(@PathVariable UUID providerId,
                                                                    @RequestParam String start,
                                                                    @RequestParam String end,
                                                                    @RequestParam(defaultValue = "false") boolean includeCancelled) {
        LocalDate s = LocalDate.parse(start);
        LocalDate e = LocalDate.parse(end);
        return ResponseEntity.ok(service.monthly(providerId, s, e, includeCancelled));
    }
}
