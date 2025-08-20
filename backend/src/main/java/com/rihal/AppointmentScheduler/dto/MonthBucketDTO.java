package com.rihal.AppointmentScheduler.dto;

import java.time.YearMonth;
import java.util.List;

public class MonthBucketDTO {
    public YearMonth month;   // e.g. 2025-08
    public long total;
    public List<AppointmentDTO> items;
}
