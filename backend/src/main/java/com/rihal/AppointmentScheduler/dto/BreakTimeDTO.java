package com.rihal.AppointmentScheduler.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public class BreakTimeDTO {
    @NotNull(message = "Break start time is required")
    private LocalTime startTime;

    @NotNull(message = "Break end time is required")
    private LocalTime endTime;

    private String reason;

    // Constructors
    public BreakTimeDTO() {}

    public BreakTimeDTO(LocalTime startTime, LocalTime endTime, String reason) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.reason = reason;
    }

    // Getters and Setters
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
