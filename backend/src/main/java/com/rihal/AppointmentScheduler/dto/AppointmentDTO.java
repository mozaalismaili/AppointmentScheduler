package com.rihal.AppointmentScheduler.dto;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.AppointmentStatus;

import java.time.LocalDateTime;

public class AppointmentDTO {
    public Long id;
    public Long customerId;
    public Long providerId;
    public LocalDateTime appointmentTime;
    public AppointmentStatus status;
    public String notes;

    public static AppointmentDTO from(Appointment a) {
        AppointmentDTO d = new AppointmentDTO();
        d.id = a.getId();
        d.customerId = a.getCustomerId();
        d.providerId = a.getProviderId();
        d.appointmentTime = a.getAppointmentTime();
        d.status = a.getStatus();
        d.notes = a.getNotes();
        return d;
    }
}
