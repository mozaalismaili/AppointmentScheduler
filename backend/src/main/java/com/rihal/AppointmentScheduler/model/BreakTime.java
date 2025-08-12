package com.rihal.AppointmentScheduler.model;

import jakarta.persistence.Embeddable;
import java.time.LocalTime;

@Embeddable
public class BreakTime {
    private LocalTime startTime;
    private LocalTime endTime;
    private String reason;

    public BreakTime() {}

    public BreakTime(LocalTime startTime, LocalTime endTime, String reason) {
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