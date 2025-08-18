package com.project.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RescheduleRequest {
    private LocalDate newDate;
    private LocalTime newStartTime;
    private LocalTime newEndTime; // or compute from duration on backend

    public LocalDate getNewDate() { return newDate; }
    public void setNewDate(LocalDate newDate) { this.newDate = newDate; }
    public LocalTime getNewStartTime() { return newStartTime; }
    public void setNewStartTime(LocalTime newStartTime) { this.newStartTime = newStartTime; }
    public LocalTime getNewEndTime() { return newEndTime; }
    public void setNewEndTime(LocalTime newEndTime) { this.newEndTime = newEndTime; }
}
