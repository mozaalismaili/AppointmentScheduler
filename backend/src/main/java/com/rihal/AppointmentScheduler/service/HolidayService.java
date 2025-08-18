package com.rihal.AppointmentScheduler.service;

import com.rihal.AppointmentScheduler.model.Holiday;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.dto.HolidayDTO;
import com.rihal.AppointmentScheduler.repository.HolidayRepository;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class HolidayService {

    @Autowired
    private HolidayRepository holidayRepository;

    @Autowired
    private UserRepository userRepository;

    public List<HolidayDTO> getAllHolidaysByProvider(Long providerId) {
        return holidayRepository.findByProviderId(providerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HolidayDTO> getUpcomingHolidaysByProvider(Long providerId) {
        return holidayRepository.findUpcomingHolidaysByProvider(providerId, LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<HolidayDTO> getHolidaysByDateRange(Long providerId, LocalDate startDate, LocalDate endDate) {
        return holidayRepository.findByProviderIdAndDateRange(providerId, startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public HolidayDTO getHolidayById(Long id) {
        Holiday holiday = holidayRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Holiday not found with id: " + id));
        return convertToDTO(holiday);
    }

    public HolidayDTO createHoliday(HolidayDTO holidayDTO) {
        // Validate provider exists and is a provider
        User provider = userRepository.findById(holidayDTO.getProviderId())
                .orElseThrow(() -> new EntityNotFoundException("Provider not found with id: " + holidayDTO.getProviderId()));

        if (provider.getRole() != User.Role.PROVIDER) {
            throw new IllegalArgumentException("User is not a provider");
        }

        // Validate partial day holiday times
        if (holidayDTO.getType() == Holiday.HolidayType.PARTIAL_DAY) {
            if (holidayDTO.getStartTime() == null || holidayDTO.getEndTime() == null) {
                throw new IllegalArgumentException("Start time and end time are required for partial day holidays");
            }
            if (holidayDTO.getStartTime().isAfter(holidayDTO.getEndTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
        }

        // Check for existing holiday on the same date
        if (holidayRepository.existsByProviderIdAndDate(holidayDTO.getProviderId(), holidayDTO.getDate())) {
            throw new IllegalArgumentException("Holiday already exists for this date");
        }

        Holiday holiday = convertToEntity(holidayDTO, provider);
        holiday = holidayRepository.save(holiday);
        return convertToDTO(holiday);
    }

    public HolidayDTO updateHoliday(Long id, HolidayDTO holidayDTO) {
        Holiday existingHoliday = holidayRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Holiday not found with id: " + id));

        // Validate partial day holiday times
        if (holidayDTO.getType() == Holiday.HolidayType.PARTIAL_DAY) {
            if (holidayDTO.getStartTime() == null || holidayDTO.getEndTime() == null) {
                throw new IllegalArgumentException("Start time and end time are required for partial day holidays");
            }
            if (holidayDTO.getStartTime().isAfter(holidayDTO.getEndTime())) {
                throw new IllegalArgumentException("Start time must be before end time");
            }
        }

        // Update fields
        existingHoliday.setDate(holidayDTO.getDate());
        existingHoliday.setReason(holidayDTO.getReason());
        existingHoliday.setType(holidayDTO.getType());
        existingHoliday.setStartTime(holidayDTO.getStartTime());
        existingHoliday.setEndTime(holidayDTO.getEndTime());

        existingHoliday = holidayRepository.save(existingHoliday);
        return convertToDTO(existingHoliday);
    }

    public void deleteHoliday(Long id) {
        if (!holidayRepository.existsById(id)) {
            throw new EntityNotFoundException("Holiday not found with id: " + id);
        }
        holidayRepository.deleteById(id);
    }

    public boolean isHoliday(Long providerId, LocalDate date) {
        return holidayRepository.existsByProviderIdAndDate(providerId, date);
    }

    private Holiday convertToEntity(HolidayDTO dto, User provider) {
        Holiday holiday = new Holiday();
        holiday.setProvider(provider);
        holiday.setDate(dto.getDate());
        holiday.setReason(dto.getReason());
        holiday.setType(dto.getType());
        holiday.setStartTime(dto.getStartTime());
        holiday.setEndTime(dto.getEndTime());
        return holiday;
    }

    private HolidayDTO convertToDTO(Holiday holiday) {
        HolidayDTO dto = new HolidayDTO();
        dto.setId(holiday.getId());
        dto.setProviderId(holiday.getProvider().getId());
        dto.setDate(holiday.getDate());
        dto.setReason(holiday.getReason());
        dto.setType(holiday.getType());
        dto.setStartTime(holiday.getStartTime());
        dto.setEndTime(holiday.getEndTime());
        return dto;
    }
}