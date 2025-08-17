package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;
import java.util.UUID;

public interface AvailabilityRepository extends JpaRepository<Availability, UUID> {
    Optional<Availability> findByProviderIdAndDayOfWeek(UUID providerId, DayOfWeek dayOfWeek);
}
