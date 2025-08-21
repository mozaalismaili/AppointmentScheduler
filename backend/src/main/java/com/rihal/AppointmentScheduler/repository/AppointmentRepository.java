package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.AppointmentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    // ✅ Paginated search for customer with filters
    @Query("""
        SELECT a FROM Appointment a
        WHERE a.customerId = :customerId
          AND (:status IS NULL OR a.status = :status)
          AND (:fromDate IS NULL OR a.date >= :fromDate)
          AND (:toDate IS NULL OR a.date <= :toDate)
        """)
    Page<Appointment> searchCustomer(
            @Param("customerId") UUID customerId,
            @Param("status") AppointmentStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);

    // ✅ Paginated search for provider with filters
    @Query("""
        SELECT a FROM Appointment a
        WHERE a.providerId = :providerId
          AND (:status IS NULL OR a.status = :status)
          AND (:fromDate IS NULL OR a.date >= :fromDate)
          AND (:toDate IS NULL OR a.date <= :toDate)
        """)
    Page<Appointment> searchProvider(
            @Param("providerId") UUID providerId,
            @Param("status") AppointmentStatus status,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable);

    // ✅ Find appointments by customer
    List<Appointment> findByCustomerId(UUID customerId);

    // ✅ Find appointments by provider
    List<Appointment> findByProviderId(UUID providerId);

    // ✅ Find provider appointments within date range
    List<Appointment> findByProviderIdAndDateBetween(UUID providerId, LocalDate start, LocalDate end);

    // ✅ Check overlap (avoids double-booking)
    @Query("""
        SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
        FROM Appointment a
        WHERE a.providerId = :providerId
          AND a.date = :date
          AND a.status = com.rihal.AppointmentScheduler.model.AppointmentStatus.BOOKED
          AND (:appointmentId IS NULL OR a.id <> :appointmentId)
          AND (:newStart < a.endTime AND a.startTime < :newEnd)
        """)
    boolean existsOverlap(@Param("providerId") UUID providerId,
                          @Param("date") LocalDate date,
                          @Param("newStart") LocalTime newStart,
                          @Param("newEnd") LocalTime newEnd,
                          @Param("appointmentId") UUID appointmentId);

    // ✅ Pessimistic lock for provider’s appointments (to prevent race conditions)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId AND a.date = :date")
    List<Appointment> findForUpdate(@Param("providerId") UUID providerId,
                                    @Param("date") LocalDate date);
}
