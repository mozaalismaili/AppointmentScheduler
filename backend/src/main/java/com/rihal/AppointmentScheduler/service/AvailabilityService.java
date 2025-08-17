package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.model.Availability;
import com.rihal.AppointmentScheduler.model.BreakTime;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.dto.AvailabilityDTO;
import com.rihal.AppointmentScheduler.dto.BreakTimeDTO;
import com.rihal.AppointmentScheduler.repository.AvailabilityRepository;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AvailabilityDTO> getAllAvailabilitiesByProvider(Long providerId) {
        return availabilityRepository.findByProviderId(providerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AvailabilityDTO> getActiveAvailabilitiesByProvider(Long providerId) {
        return availabilityRepository.findActiveAvailabilitiesByProvider(providerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AvailabilityDTO getAvailabilityById(Long id) {
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with id: " + id));
        return convertToDTO(availability);
    }

    public AvailabilityDTO createAvailability(AvailabilityDTO availabilityDTO) {
        // Validate provider exists and is a provider
        User provider = userRepository.findById(availabilityDTO.getProviderId())
                .orElseThrow(() -> new EntityNotFoundException("Provider not found with id: " + availabilityDTO.getProviderId()));

        if (provider.getRole() != User.Role.PROVIDER) {
            throw new IllegalArgumentException("User is not a provider");
        }

        // Validate time slots
        validateTimeSlots(availabilityDTO);

        // Check for existing availability on the same day
        if (availabilityRepository.existsByProviderIdAndDayOfWeek(
                availabilityDTO.getProviderId(), availabilityDTO.getDayOfWeek())) {
            throw new IllegalArgumentException("Availability already exists for this day of week");
        }

        Availability availability = convertToEntity(availabilityDTO, provider);
        availability = availabilityRepository.save(availability);
        return convertToDTO(availability);
    }

    public AvailabilityDTO updateAvailability(Long id, AvailabilityDTO availabilityDTO) {
        Availability existingAvailability = availabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with id: " + id));

        // Validate time slots
        validateTimeSlots(availabilityDTO);

        // Update fields
        existingAvailability.setDayOfWeek(availabilityDTO.getDayOfWeek());
        existingAvailability.setStartTime(availabilityDTO.getStartTime());
        existingAvailability.setEndTime(availabilityDTO.getEndTime());
        existingAvailability.setSlotDurationMinutes(availabilityDTO.getSlotDurationMinutes());
        existingAvailability.setIsActive(availabilityDTO.getIsActive());

        // Update break times
        if (availabilityDTO.getBreakTimes() != null) {
            List<BreakTime> breakTimes = availabilityDTO.getBreakTimes().stream()
                    .map(this::convertBreakTimeToEntity)
                    .collect(Collectors.toList());
            existingAvailability.setBreakTimes(breakTimes);
        }

        existingAvailability = availabilityRepository.save(existingAvailability);
        return convertToDTO(existingAvailability);
    }

    public void deleteAvailability(Long id) {
        if (!availabilityRepository.existsById(id)) {
            throw new EntityNotFoundException("Availability not found with id: " + id);
        }
        availabilityRepository.deleteById(id);
    }

    public AvailabilityDTO toggleAvailabilityStatus(Long id) {
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Availability not found with id: " + id));

        availability.setIsActive(!availability.getIsActive());
        availability = availabilityRepository.save(availability);
        return convertToDTO(availability);
    }

    private void validateTimeSlots(AvailabilityDTO availabilityDTO) {
        if (availabilityDTO.getStartTime().isAfter(availabilityDTO.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (availabilityDTO.getBreakTimes() != null) {
            for (BreakTimeDTO breakTime : availabilityDTO.getBreakTimes()) {
                if (breakTime.getStartTime().isAfter(breakTime.getEndTime())) {
                    throw new IllegalArgumentException("Break start time must be before break end time");
                }

                if (breakTime.getStartTime().isBefore(availabilityDTO.getStartTime()) ||
                        breakTime.getEndTime().isAfter(availabilityDTO.getEndTime())) {
                    throw new IllegalArgumentException("Break times must be within availability hours");
                }
            }
        }
    }

    private Availability convertToEntity(AvailabilityDTO dto, User provider) {
        Availability availability = new Availability();
        availability.setProvider(provider);
        availability.setDayOfWeek(dto.getDayOfWeek());
        availability.setStartTime(dto.getStartTime());
        availability.setEndTime(dto.getEndTime());
        availability.setSlotDurationMinutes(dto.getSlotDurationMinutes());
        availability.setIsActive(dto.getIsActive());

        if (dto.getBreakTimes() != null) {
            List<BreakTime> breakTimes = dto.getBreakTimes().stream()
                    .map(this::convertBreakTimeToEntity)
                    .collect(Collectors.toList());
            availability.setBreakTimes(breakTimes);
        }

        return availability;
    }

    private AvailabilityDTO convertToDTO(Availability availability) {
        AvailabilityDTO dto = new AvailabilityDTO();
        dto.setId(availability.getId());
        dto.setProviderId(availability.getProvider().getId());
        dto.setDayOfWeek(availability.getDayOfWeek());
        dto.setStartTime(availability.getStartTime());
        dto.setEndTime(availability.getEndTime());
        dto.setSlotDurationMinutes(availability.getSlotDurationMinutes());
        dto.setIsActive(availability.getIsActive());

        if (availability.getBreakTimes() != null) {
            List<BreakTimeDTO> breakTimeDTOs = availability.getBreakTimes().stream()
                    .map(this::convertBreakTimeToDTO)
                    .collect(Collectors.toList());
            dto.setBreakTimes(breakTimeDTOs);
        }

        return dto;
    }

    private BreakTime convertBreakTimeToEntity(BreakTimeDTO dto) {
        return new BreakTime(dto.getStartTime(), dto.getEndTime(), dto.getReason());
    }

    private BreakTimeDTO convertBreakTimeToDTO(BreakTime breakTime) {
        return new BreakTimeDTO(breakTime.getStartTime(), breakTime.getEndTime(), breakTime.getReason());
    }
}
