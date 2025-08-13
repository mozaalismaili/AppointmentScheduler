package com.rihal.AppointmentScheduler.dto;

import jakarta.validation.constraints.NotNull;
import com.rihal.AppointmentScheduler.model.Holiday.HolidayType;
import java.time.LocalDate;
import java.time.LocalTime;

public class HolidayDTO {
    private Long id;

    @NotNull(message = "Provider ID is required")
    private Long providerId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String reason;

    private HolidayType type = HolidayType.FULL_DAY;

    // For partial day holidays
    private LocalTime startTime;
    private LocalTime endTime;

    // Constructors
    public HolidayDTO() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public HolidayType getType() { return type; }
    public void setType(HolidayType type) { this.type = type; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}