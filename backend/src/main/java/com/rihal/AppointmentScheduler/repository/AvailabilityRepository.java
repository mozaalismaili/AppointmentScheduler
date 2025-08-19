package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, UUID> {

    List<Availability> findByProviderId(UUID providerId);

    List<Availability> findByProviderIdAndIsActive(UUID providerId, Boolean isActive);

    List<Availability> findByProviderIdAndDayOfWeek(UUID providerId, DayOfWeek dayOfWeek);

    @Query("SELECT a FROM Availability a WHERE a.provider.id = :providerId AND a.isActive = true ORDER BY a.dayOfWeek, a.startTime")
    List<Availability> findActiveAvailabilitiesByProvider(@Param("providerId") UUID providerId);

    boolean existsByProviderIdAndDayOfWeek(UUID providerId, DayOfWeek dayOfWeek);

    Optional<Availability> findByProviderIdAndDayOfWeek(UUID providerId, DayOfWeek dayOfWeek);
}
