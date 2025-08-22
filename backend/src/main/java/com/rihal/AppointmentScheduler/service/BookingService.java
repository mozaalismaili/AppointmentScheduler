package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.config.AppointmentConfig;
import com.rihal.AppointmentScheduler.dto.BookingRequest;
import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentConfig config;
    private static final int CANCELLATION_LIMIT_HOURS = 24;

    public BookingService(AppointmentRepository appointmentRepository, AppointmentConfig config) {
        this.appointmentRepository = appointmentRepository;
        this.config = config;
    }

    @Transactional
    public void createBooking(UUID customerId, UUID providerId, LocalDate date, LocalTime startTime, 
                             String customerName, String customerPhone, String serviceType, String notes) {
        // 1. Validate provider exists (optional, but good practice)
        // This assumes providerId is a UUID, but User.id is Long. This is a mismatch.
        // For now, we'll proceed assuming the UUID providerId is valid.
        // A proper fix would involve changing User.id to UUID or having a UUID field in User.

        // 2. Check for overlap with existing appointments for the provider on that date
        // Use pessimistic lock to prevent race conditions during booking
        List<Appointment> existingAppointments = appointmentRepository.findForUpdate(providerId, date);

        // Calculate end time based on default slot duration
        LocalTime endTime = startTime.plusMinutes(config.getDefaultSlotMinutes());

        boolean overlaps = appointmentRepository.existsOverlap(providerId, date, startTime, endTime, null);
        if (overlaps) {
            throw new RuntimeException("The selected slot is already booked or overlaps with an existing appointment.");
        }

        // 3. Create and save the new appointment
        Appointment newAppointment = new Appointment();
        newAppointment.setCustomerId(customerId);
        newAppointment.setProviderId(providerId);
        newAppointment.setDate(date);
        newAppointment.setStartTime(startTime);
        newAppointment.setEndTime(endTime); // Set end time based on slot duration
        newAppointment.setStatus(Appointment.Status.BOOKED);
        newAppointment.setCustomerName(customerName);
        newAppointment.setCustomerPhone(customerPhone);
        newAppointment.setServiceType(serviceType);
        newAppointment.setNotes(notes);

        appointmentRepository.save(newAppointment);
    }

    public void cancel(UUID appointmentId, UUID customerId, boolean isProviderOrAdmin) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appt.getStatus() == Appointment.Status.CANCELLED) {
            throw new RuntimeException("Appointment already cancelled.");
        }

        if (!isProviderOrAdmin && !appt.getCustomerId().equals(customerId)) {
            throw new RuntimeException("You can only cancel your own appointments.");
        }

        LocalDateTime start = LocalDateTime.of(appt.getDate(), appt.getStartTime());
        long hoursBefore = Duration.between(LocalDateTime.now(), start).toHours();

        if (!isProviderOrAdmin && hoursBefore < CANCELLATION_LIMIT_HOURS) {
            throw new RuntimeException("Must cancel at least " + CANCELLATION_LIMIT_HOURS + " hours before start.");
        }

        appt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appt);
    }
}
