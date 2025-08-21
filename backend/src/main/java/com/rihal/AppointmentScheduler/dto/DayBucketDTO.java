package com.rihal.AppointmentScheduler.dto;

import java.time.LocalDate;
import java.util.List;

public class DayBucketDTO {
    public LocalDate date;
    public long total;
    public List<AppointmentDTO> items;
}
