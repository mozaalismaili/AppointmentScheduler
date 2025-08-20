package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.dto.BookingRequest;
import com.rihal.AppointmentScheduler.model.AppointmentStatus;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) { this.repo = repo; }

    public Page<AppointmentDTO> getForCustomer(Long customerId, AppointmentStatus status,
                                               LocalDateTime from, LocalDateTime to,
                                               Pageable pageable) {
        return repo.searchCustomer(customerId, status, from, to, pageable).map(AppointmentDTO::from);
    }

    public Page<AppointmentDTO> getForProvider(Long providerId, AppointmentStatus status,
                                               LocalDateTime from, LocalDateTime to,
                                               Pageable pageable) {
        return repo.searchProvider(providerId, status, from, to, pageable).map(AppointmentDTO::from);
    }
}
