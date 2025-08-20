package com.rihal.AppointmentScheduler.dto;

import java.time.LocalDate;
import java.util.List;

public class WeekBucketDTO {
    public int week;          // ISO week number (1-53)
    public int weekYear;      // ISO week-based-year
    public LocalDate start;   // Monday
    public LocalDate end;     // Sunday
    public long total;
    public List<AppointmentDTO> items;
}
