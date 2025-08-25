package com.rihal.AppointmentScheduler.dto;

import java.time.LocalTime;

public class TimeSlotDTO {
    
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean isAvailable;
    private String status; // "available", "booked", "break", "unavailable"
    
    // Constructors
    public TimeSlotDTO() {}
    
    public TimeSlotDTO(LocalTime startTime, LocalTime endTime, boolean isAvailable) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.isAvailable = isAvailable;
        this.status = isAvailable ? "available" : "unavailable";
    }
    
    public TimeSlotDTO(LocalTime startTime, LocalTime endTime, String status) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.isAvailable = "available".equals(status);
    }
    
    // Getters and Setters
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    // Helper method to get formatted time string
    public String getFormattedTime() {
        if (startTime != null && endTime != null) {
            return startTime.toString() + " - " + endTime.toString();
        }
        return startTime != null ? startTime.toString() : "";
    }
}
