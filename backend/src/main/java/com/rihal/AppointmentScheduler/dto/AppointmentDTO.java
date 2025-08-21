package com.rihal.AppointmentScheduler.dto;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class AppointmentDTO {
    public UUID id;
    public UUID customerId;
    public UUID providerId;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public AppointmentStatus status;
    public String notes;

    // ✅ Factory method to convert entity → DTO
    public static AppointmentDTO from(Appointment a) {
        AppointmentDTO d = new AppointmentDTO();
        d.id = a.getId();
        d.customerId = a.getCustomerId();
        d.providerId = a.getProviderId();
        d.date = a.getDate();
        d.startTime = a.getStartTime();
        d.endTime = a.getEndTime();
        d.status = a.getStatus();
        d.notes = a.getNotes();
        return d;
    }
}
