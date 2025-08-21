package com.rihal.AppointmentScheduler.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class AppointmentDTO {
    public UUID id;
    public UUID customerId;
    public UUID providerId;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public String status;
}

