package com.rihal.AppointmentScheduler.service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.Availability;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.AvailabilityRepository;

@Service
public class SlotService {

    private final AvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;

    private static final Duration STEP = Duration.ofMinutes(30);

    public SlotService(AvailabilityRepository availabilityRepository,
                       AppointmentRepository appointmentRepository) {
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<LocalTime> getSlots(UUID providerId, LocalDate date) {
        List<Availability> availabilities = availabilityRepository
                .findByProviderIdAndDayOfWeek(providerId, date.getDayOfWeek());

        if (availabilities.isEmpty()) return List.of();

        // Get the first availability for the day (assuming one per day)
        Availability availability = availabilities.get(0);

        List<LocalTime> allSlots = enumerate(availability.getStartTime(), availability.getEndTime(), STEP);
        List<Appointment> booked = appointmentRepository
                .findByProviderIdAndDateAndStatus(providerId, date, Appointment.Status.BOOKED);

        Set<LocalTime> taken = booked.stream()
                .map(Appointment::getStartTime)
                .collect(Collectors.toSet());

        return allSlots.stream().filter(t -> !taken.contains(t)).toList();
    }

    private List<LocalTime> enumerate(LocalTime start, LocalTime end, Duration step) {
        List<LocalTime> times = new ArrayList<>();
        for (LocalTime t = start; !t.plus(step).isAfter(end); t = t.plus(step)) {
            times.add(t);
        }
        return times;
    }
}
