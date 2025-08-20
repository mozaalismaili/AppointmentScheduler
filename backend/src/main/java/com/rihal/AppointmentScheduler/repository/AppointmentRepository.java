package com.rihal.AppointmentScheduler.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rihal.AppointmentScheduler.model.Appointment;

import jakarta.persistence.LockModeType;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    // Find by provider and date, filtered by status (uses enum type-safety)
    List<Appointment> findByProviderIdAndDateAndStatus(UUID providerId, LocalDate date, Appointment.Status status);

    // Find appointments by customer ID
    List<Appointment> findByCustomerId(UUID customerId);

    // Find appointments by provider ID
    List<Appointment> findByProviderId(UUID providerId);

    // Add missing method for CalendarService
    List<Appointment> findByProviderIdAndDateBetween(UUID providerId, LocalDate start, LocalDate end);

    // Check if another booked appointment overlaps the requested slot
    @Query("""
        SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
        FROM Appointment a
        WHERE a.providerId = :providerId
          AND a.date = :date
          AND a.status = com.rihal.AppointmentScheduler.model.Appointment.Status.BOOKED
          AND (:appointmentId IS NULL OR a.id <> :appointmentId)
          AND (:newStart < a.endTime AND a.startTime < :newEnd)
        """)
    boolean existsOverlap(@Param("providerId") UUID providerId,
                          @Param("date") LocalDate date,
                          @Param("newStart") LocalTime newStart,
                          @Param("newEnd") LocalTime newEnd,
                          @Param("appointmentId") UUID appointmentId);

    // Lock provider's appointments on a given date to avoid race conditions
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId AND a.date = :date")
    List<Appointment> findForUpdate(@Param("providerId") UUID providerId,
                                    @Param("date") LocalDate date);
}
