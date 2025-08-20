package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("""
        SELECT a FROM Appointment a
        WHERE a.customerId = :customerId
          AND (:status IS NULL OR a.status = :status)
          AND (:fromDt IS NULL OR a.appointmentTime >= :fromDt)
          AND (:toDt IS NULL OR a.appointmentTime <= :toDt)
        """)
    Page<Appointment> searchCustomer(
            @Param("customerId") Long customerId,
            @Param("status") AppointmentStatus status,
            @Param("fromDt") LocalDateTime from,
            @Param("toDt") LocalDateTime to,
            Pageable pageable);

    @Query("""
        SELECT a FROM Appointment a
        WHERE a.providerId = :providerId
          AND (:status IS NULL OR a.status = :status)
          AND (:fromDt IS NULL OR a.appointmentTime >= :fromDt)
          AND (:toDt IS NULL OR a.appointmentTime <= :toDt)
        """)
    Page<Appointment> searchProvider(
            @Param("providerId") Long providerId,
            @Param("status") AppointmentStatus status,
            @Param("fromDt") LocalDateTime from,
            @Param("toDt") LocalDateTime to,
            Pageable pageable);
}
