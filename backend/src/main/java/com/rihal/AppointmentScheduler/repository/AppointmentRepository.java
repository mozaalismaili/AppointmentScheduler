package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByProviderIdAndDateAndStatus(UUID providerId, LocalDate date, String status);
}
