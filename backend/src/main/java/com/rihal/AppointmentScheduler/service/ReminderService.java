package com.rihal.AppointmentScheduler.service;


import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.NotificationLog.Channel;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {
    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    public ReminderService(AppointmentRepository appointmentRepository,
                           NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.notificationService = notificationService;
}
@Scheduled(fixedRate = 60 * 60 * 1000) // every hour
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now();

        // Load all appointments
        List<Appointment> appointments = appointmentRepository.findAll();

        for (Appointment appt : appointments) {
            if (appt.getStatus() != Appointment.Status.BOOKED) {
                continue; // skip cancelled
            }

            LocalDateTime appointmentTime = LocalDateTime.of(appt.getDate(), appt.getStartTime());

            long hoursUntil = java.time.Duration.between(now, appointmentTime).toHours();

            if (hoursUntil == 24) {
                String subject = "Appointment Reminder";
                String content = "Reminder: You have an upcoming appointment  " +
                        appt.getDate() + " at " + appt.getStartTime() + ".";

                notificationService.logSent(
                        "APPOINTMENT_REMINDER",
                        Channel.IN_APP,  // or EMAIL later
                        appt.getCustomerId(),
                        appt.getId(),
                        subject,
                        content,
                        null
                );

                System.out.println("🔔 Reminder was sent for appointment " + appt.getId());
            }
        }
    }
   }

