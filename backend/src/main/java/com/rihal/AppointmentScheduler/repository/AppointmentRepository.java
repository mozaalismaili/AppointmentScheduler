package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByProviderIdAndDateAndStatus(UUID providerId, LocalDate date, String status);
    // Check if another booked appointment overlaps the new requested slot
    @Query("""
        SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
        FROM Appointment a
        WHERE a.provider.id = :providerId
          AND a.date = :date
          AND a.status = 'BOOKED'
          AND a.id <> :appointmentId
          AND (:newStart < a.endTime AND a.startTime < :newEnd)
        """)
    boolean existsOverlap(@Param("providerId") UUID providerId,
                          @Param("date") LocalDate date,
                          @Param("newStart") LocalTime newStart,
                          @Param("newEnd") LocalTime newEnd,
                          @Param("appointmentId") UUID appointmentId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.provider.id = :providerId AND a.date = :date")
    List<Appointment> findForUpdate(@Param("providerId") UUID providerId, @Param("date") LocalDate date);

}
