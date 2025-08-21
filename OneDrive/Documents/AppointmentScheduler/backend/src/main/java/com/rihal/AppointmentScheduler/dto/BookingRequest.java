package com.rihal.AppointmentScheduler.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class BookingRequest {
    private UUID customerId;
    private UUID providerId;
    private LocalDate date;
    private LocalTime startTime;

    public UUID getCustomerId() { return customerId; }
    public void setCustomerId(UUID customerId) { this.customerId = customerId; }

    public UUID getProviderId() { return providerId; }
    public void setProviderId(UUID providerId) { this.providerId = providerId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
}
