package com.rihal.AppointmentScheduler.repository;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rihal.AppointmentScheduler.model.Availability;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByProviderId(Long providerId);

    List<Availability> findByProviderIdAndIsActive(Long providerId, Boolean isActive);

    List<Availability> findByProviderIdAndDayOfWeek(Long providerId, DayOfWeek dayOfWeek);

    @Query("SELECT a FROM Availability a WHERE a.provider.id = :providerId AND a.isActive = true ORDER BY a.dayOfWeek, a.startTime")
    List<Availability> findActiveAvailabilitiesByProvider(@Param("providerId") Long providerId);

    boolean existsByProviderIdAndDayOfWeek(Long providerId, DayOfWeek dayOfWeek);
}
