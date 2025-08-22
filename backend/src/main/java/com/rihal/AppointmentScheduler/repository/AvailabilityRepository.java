package com.rihal.AppointmentScheduler.repository;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rihal.AppointmentScheduler.model.Availability;
import com.rihal.AppointmentScheduler.model.User;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    @Query("SELECT a FROM Availability a WHERE a.provider.id = :providerId")
    List<Availability> findByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT a FROM Availability a WHERE a.provider.id = :providerId AND a.isActive = :isActive")
    List<Availability> findByProviderIdAndIsActive(@Param("providerId") Long providerId, @Param("isActive") Boolean isActive);

    @Query("SELECT a FROM Availability a WHERE a.provider.id = :providerId AND a.dayOfWeek = :dayOfWeek")
    List<Availability> findByProviderIdAndDayOfWeek(@Param("providerId") Long providerId, @Param("dayOfWeek") DayOfWeek dayOfWeek);

    @Query("SELECT a FROM Availability a WHERE a.provider.id = :providerId AND a.isActive = true ORDER BY a.dayOfWeek, a.startTime")
    List<Availability> findActiveAvailabilitiesByProvider(@Param("providerId") Long providerId);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Availability a WHERE a.provider.id = :providerId AND a.dayOfWeek = :dayOfWeek")
    boolean existsByProviderIdAndDayOfWeek(@Param("providerId") Long providerId, @Param("dayOfWeek") DayOfWeek dayOfWeek);
}
