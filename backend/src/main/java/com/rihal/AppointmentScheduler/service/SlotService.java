package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.Availability;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.AvailabilityRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

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
        Availability availability = availabilityRepository
                .findByProviderIdAndDayOfWeek(providerId, date.getDayOfWeek())
                .orElse(null);
        if (availability == null) return List.of();

        List<LocalTime> allSlots = enumerate(availability.getStartTime(), availability.getEndTime(), STEP);
        List<Appointment> booked = appointmentRepository
                .findByProviderIdAndDateAndStatus(providerId, date, "BOOKED");

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
