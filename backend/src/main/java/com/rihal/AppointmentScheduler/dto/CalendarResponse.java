package com.rihal.AppointmentScheduler.dto;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID; /** Generic envelope for calendar responses */
public class CalendarResponse<T> {
    public UUID providerId;
    public LocalDate rangeStart;
    public LocalDate rangeEnd;
    public long total;        // total appointments in range (after filters)
    public Map<String, T> buckets; // key depends on grouping (date, weekId, month)
}
