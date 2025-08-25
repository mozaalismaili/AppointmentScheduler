package com.rihal.AppointmentScheduler.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rihal.AppointmentScheduler.dto.ServiceDTO;
import com.rihal.AppointmentScheduler.model.ServiceModel;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.repository.ServiceRepository;
import com.rihal.AppointmentScheduler.repository.UserRepository;

@Service
@Transactional
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    // Create a new service
    public ServiceDTO createService(ServiceDTO serviceDTO, Long providerId) {
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        // Check if service name already exists for this provider
        if (serviceRepository.existsByNameAndProvider_IdAndIsActiveTrue(serviceDTO.getName(), providerId)) {
            throw new RuntimeException("Service with this name already exists");
        }

        ServiceModel service = new ServiceModel();
        service.setProvider(provider);
        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setDurationMinutes(serviceDTO.getDurationMinutes());
        service.setPrice(serviceDTO.getPrice());
        service.setCategory(serviceDTO.getCategory());
        service.setIsActive(true);

        ServiceModel savedService = serviceRepository.save(service);
        return convertToDTO(savedService);
    }

    // Update an existing service
    public ServiceDTO updateService(Long serviceId, ServiceDTO serviceDTO, Long providerId) {
        ServiceModel service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Verify the service belongs to the provider
        if (!service.getProviderId().equals(providerId)) {
            throw new RuntimeException("Service not found or access denied");
        }

        // Check if new name conflicts with existing services (excluding current
        // service)
        if (!service.getName().equals(serviceDTO.getName()) &&
                serviceRepository.existsByNameAndProvider_IdAndIsActiveTrue(serviceDTO.getName(), providerId)) {
            throw new RuntimeException("Service with this name already exists");
        }

        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setDurationMinutes(serviceDTO.getDurationMinutes());
        service.setPrice(serviceDTO.getPrice());
        service.setCategory(serviceDTO.getCategory());

        ServiceModel updatedService = serviceRepository.save(service);
        return convertToDTO(updatedService);
    }

    // Delete a service (soft delete)
    public void deleteService(Long serviceId, Long providerId) {
        ServiceModel service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Verify the service belongs to the provider
        if (!service.getProviderId().equals(providerId)) {
            throw new RuntimeException("Service not found or access denied");
        }

        service.setIsActive(false);
        serviceRepository.save(service);
    }

    // Get all services for a provider
    public List<ServiceDTO> getProviderServices(Long providerId) {
        List<ServiceModel> services = serviceRepository.findByProvider_IdAndIsActiveTrue(providerId);
        return services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get all active services
    public List<ServiceDTO> getAllActiveServices() {
        List<ServiceModel> services = serviceRepository.findByIsActiveTrue();
        return services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get service by ID
    public ServiceDTO getServiceById(Long serviceId) {
        ServiceModel service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.getIsActive()) {
            throw new RuntimeException("Service not found");
        }

        return convertToDTO(service);
    }

    // Get services by category
    public List<ServiceDTO> getServicesByCategory(ServiceModel.Category category) {
        List<ServiceModel> services = serviceRepository.findByCategoryAndIsActiveTrue(category);
        return services.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Convert ServiceModel entity to DTO
    private ServiceDTO convertToDTO(ServiceModel service) {
        ServiceDTO dto = new ServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setDurationMinutes(service.getDurationMinutes());
        dto.setPrice(service.getPrice());
        dto.setCategory(service.getCategory());
        dto.setProviderId(service.getProviderId());
        dto.setIsActive(service.getIsActive());
        return dto;
    }
}
