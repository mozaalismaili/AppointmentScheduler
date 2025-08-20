package com.rihal.AppointmentScheduler.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "notification_logs")
public class NotificationLog {

	public enum Channel { EMAIL, SMS, PUSH, IN_APP }

	public enum Status { SENT, FAILED }

	@Id
	@GeneratedValue
	private UUID id;

	@Column(name = "recipient_user_id")
	private UUID recipientUserId;

	@Column(name = "appointment_id")
	private UUID appointmentId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Channel channel;

	@Column(name = "event_type", nullable = false)
	private String eventType;

	private String subject;

	@Column(columnDefinition = "TEXT")
	private String content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Status status;

	@Column(name = "error_message")
	private String errorMessage;

	@Column(name = "correlation_id")
	private String correlationId;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@Column(name = "sent_at")
	private LocalDateTime sentAt;

	public UUID getId() { return id; }
	public void setId(UUID id) { this.id = id; }

	public UUID getRecipientUserId() { return recipientUserId; }
	public void setRecipientUserId(UUID recipientUserId) { this.recipientUserId = recipientUserId; }

	public UUID getAppointmentId() { return appointmentId; }
	public void setAppointmentId(UUID appointmentId) { this.appointmentId = appointmentId; }

	public Channel getChannel() { return channel; }
	public void setChannel(Channel channel) { this.channel = channel; }

	public String getEventType() { return eventType; }
	public void setEventType(String eventType) { this.eventType = eventType; }

	public String getSubject() { return subject; }
	public void setSubject(String subject) { this.subject = subject; }

	public String getContent() { return content; }
	public void setContent(String content) { this.content = content; }

	public Status getStatus() { return status; }
	public void setStatus(Status status) { this.status = status; }

	public String getErrorMessage() { return errorMessage; }
	public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

	public String getCorrelationId() { return correlationId; }
	public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }

	public LocalDateTime getCreatedAt() { return createdAt; }
	public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

	public LocalDateTime getSentAt() { return sentAt; }
	public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}


