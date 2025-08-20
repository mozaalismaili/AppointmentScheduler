package com.rihal.AppointmentScheduler.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rihal.AppointmentScheduler.model.NotificationLog;

@Repository
public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {
	List<NotificationLog> findByAppointmentId(UUID appointmentId);
	List<NotificationLog> findByRecipientUserId(UUID recipientUserId);
}


