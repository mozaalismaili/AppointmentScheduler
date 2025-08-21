package com.rihal.AppointmentScheduler.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rihal.AppointmentScheduler.model.NotificationLog;
import com.rihal.AppointmentScheduler.model.NotificationLog.Channel;
import com.rihal.AppointmentScheduler.model.NotificationLog.Status;
import com.rihal.AppointmentScheduler.repository.NotificationLogRepository;

@Service
public class NotificationService {

	private final NotificationLogRepository notificationLogRepository;

	public NotificationService(NotificationLogRepository notificationLogRepository) {
		this.notificationLogRepository = notificationLogRepository;
	}

	@Transactional
	public NotificationLog logSent(String eventType,
			Channel channel,
			UUID recipientUserId,
			UUID appointmentId,
			String subject,
			String content,
			String correlationId) {
		NotificationLog log = new NotificationLog();
		log.setEventType(eventType);
		log.setChannel(channel);
		log.setRecipientUserId(recipientUserId);
		log.setAppointmentId(appointmentId);
		log.setSubject(subject);
		log.setContent(content);
		log.setStatus(Status.SENT);
		log.setCorrelationId(correlationId);
		log.setSentAt(LocalDateTime.now());
		return notificationLogRepository.save(log);
	}

	@Transactional
	public NotificationLog logFailure(String eventType,
			Channel channel,
			UUID recipientUserId,
			UUID appointmentId,
			String subject,
			String content,
			String errorMessage,
			String correlationId) {
		NotificationLog log = new NotificationLog();
		log.setEventType(eventType);
		log.setChannel(channel);
		log.setRecipientUserId(recipientUserId);
		log.setAppointmentId(appointmentId);
		log.setSubject(subject);
		log.setContent(content);
		log.setStatus(Status.FAILED);
		log.setErrorMessage(errorMessage);
		log.setCorrelationId(correlationId);
		log.setSentAt(LocalDateTime.now());
		return notificationLogRepository.save(log);
	}
}


