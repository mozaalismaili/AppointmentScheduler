package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId AND a.date = :date")
    List<Appointment> findForUpdate(@Param("providerId") UUID providerId, @Param("date") LocalDate date);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Appointment a " +
           "WHERE a.providerId = :providerId AND a.date = :date " +
           "AND a.status = 'BOOKED' " +
           "AND ((a.startTime < :endTime AND a.endTime > :startTime) " +
           "OR (a.startTime = :startTime)) " +
           "AND (:excludeId IS NULL OR a.id != :excludeId)")
    boolean existsOverlap(@Param("providerId") UUID providerId, 
                         @Param("date") LocalDate date, 
                         @Param("startTime") LocalTime startTime, 
                         @Param("endTime") LocalTime endTime, 
                         @Param("excludeId") UUID excludeId);

    @Query("SELECT a FROM Appointment a WHERE a.customerId = :customerId ORDER BY a.date DESC, a.startTime DESC")
    List<Appointment> findByCustomerId(@Param("customerId") UUID customerId);

    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId ORDER BY a.date DESC, a.startTime DESC")
    List<Appointment> findByProviderId(@Param("providerId") UUID providerId);

    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId AND a.date = :date AND a.status = :status")
    List<Appointment> findByProviderIdAndDateAndStatus(@Param("providerId") UUID providerId, 
                                                      @Param("date") LocalDate date, 
                                                      @Param("status") Appointment.Status status);

    @Query("SELECT a FROM Appointment a WHERE a.providerId = :providerId AND a.date BETWEEN :start AND :end ORDER BY a.date, a.startTime")
    List<Appointment> findByProviderIdAndDateBetween(@Param("providerId") UUID providerId, 
                                                    @Param("start") LocalDate start, 
                                                    @Param("end") LocalDate end);
}
