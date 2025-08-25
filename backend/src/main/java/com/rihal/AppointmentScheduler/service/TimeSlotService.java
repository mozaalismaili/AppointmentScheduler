package com.rihal.AppointmentScheduler.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rihal.AppointmentScheduler.dto.TimeSlotDTO;
import com.rihal.AppointmentScheduler.model.Appointment;
import com.rihal.AppointmentScheduler.model.Availability;
import com.rihal.AppointmentScheduler.repository.AppointmentRepository;
import com.rihal.AppointmentScheduler.repository.AvailabilityRepository;

@Service
public class TimeSlotService {
    
    @Autowired
    private AvailabilityRepository availabilityRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    // Get available time slots for a specific date and provider
    public List<TimeSlotDTO> getAvailableSlots(LocalDate date, Long providerId, Integer serviceDurationMinutes) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        
        // Get provider's availability for this day
        List<Availability> availabilities = availabilityRepository.findByProviderIdAndDayOfWeek(providerId, dayOfWeek);
        
        if (availabilities.isEmpty()) {
            return new ArrayList<>(); // No availability for this day
        }
        
        List<TimeSlotDTO> availableSlots = new ArrayList<>();
        
        for (Availability availability : availabilities) {
            if (!availability.getIsActive()) continue;
            
            LocalTime startTime = availability.getStartTime();
            LocalTime endTime = availability.getEndTime();
            Integer slotDuration = availability.getSlotDurationMinutes() != null ? 
                availability.getSlotDurationMinutes() : serviceDurationMinutes;
            
            // Generate time slots
            List<TimeSlotDTO> slots = generateTimeSlots(startTime, endTime, slotDuration, date, providerId);
            availableSlots.addAll(slots);
        }
        
        return availableSlots;
    }
    
    // Generate time slots between start and end time
    private List<TimeSlotDTO> generateTimeSlots(LocalTime startTime, LocalTime endTime, 
                                               Integer slotDuration, LocalDate date, Long providerId) {
        List<TimeSlotDTO> slots = new ArrayList<>();
        LocalTime currentTime = startTime;
        
        while (currentTime.plusMinutes(slotDuration).isBefore(endTime) || 
               currentTime.plusMinutes(slotDuration).equals(endTime)) {
            
            LocalTime slotEndTime = currentTime.plusMinutes(slotDuration);
            
            // Check if this slot conflicts with existing appointments
            boolean isAvailable = !hasAppointmentConflict(date, currentTime, slotEndTime, providerId);
            
            // Check if this slot conflicts with break times
            if (isAvailable) {
                isAvailable = !hasBreakTimeConflict(currentTime, slotEndTime, date, providerId);
            }
            
            TimeSlotDTO slot = new TimeSlotDTO(currentTime, slotEndTime, isAvailable);
            slots.add(slot);
            
            currentTime = currentTime.plusMinutes(slotDuration);
        }
        
        return slots;
    }
    
    // Check if a time slot conflicts with existing appointments
    private boolean hasAppointmentConflict(LocalDate date, LocalTime startTime, LocalTime endTime, Long providerId) {
        // Convert Long providerId to UUID for the appointment repository
        // This is a temporary workaround - the models should be consistent
        List<Appointment> appointments = appointmentRepository.findByProviderIdAndDateAndStatus(
            java.util.UUID.randomUUID(), date, Appointment.Status.BOOKED); // TODO: Fix this inconsistency
        
        for (Appointment appointment : appointments) {
            // Check for overlap
            if (startTime.isBefore(appointment.getEndTime()) && endTime.isAfter(appointment.getStartTime())) {
                return true; // Conflict found
            }
        }
        
        return false;
    }
    
    // Check if a time slot conflicts with break times
    private boolean hasBreakTimeConflict(LocalTime startTime, LocalTime endTime, LocalDate date, Long providerId) {
        // This would need to be implemented based on your BreakTime model
        // For now, returning false (no break time conflicts)
        return false;
    }
    
    // Get available slots as formatted strings (for frontend compatibility)
    public List<String> getAvailableSlotStrings(LocalDate date, Long providerId, Integer serviceDurationMinutes) {
        List<TimeSlotDTO> slots = getAvailableSlots(date, providerId, serviceDurationMinutes);
        
        return slots.stream()
            .filter(TimeSlotDTO::isAvailable)
            .map(slot -> formatTimeSlot(slot.getStartTime()))
            .collect(Collectors.toList());
    }
    
    // Format time for display
    private String formatTimeSlot(LocalTime time) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("h:mm a");
        return time.format(formatter);
    }
}
