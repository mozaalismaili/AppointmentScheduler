package com.rihal.AppointmentScheduler.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rihal.AppointmentScheduler.dto.ServiceDTO;
import com.rihal.AppointmentScheduler.model.ServiceModel;
import com.rihal.AppointmentScheduler.service.ServiceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    // Get all active services
    @GetMapping
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        List<ServiceDTO> services = serviceService.getAllActiveServices();
        return ResponseEntity.ok(services);
    }
    
    // Get services by provider
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceDTO>> getProviderServices(@PathVariable Long providerId) {
        List<ServiceDTO> services = serviceService.getProviderServices(providerId);
        return ResponseEntity.ok(services);
    }
    
    // Get service by ID
    @GetMapping("/{serviceId}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long serviceId) {
        try {
            ServiceDTO service = serviceService.getServiceById(serviceId);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get services by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ServiceDTO>> getServicesByCategory(@PathVariable String category) {
        try {
            ServiceModel.Category cat = ServiceModel.Category.valueOf(category.toUpperCase());
            List<ServiceDTO> services = serviceService.getServicesByCategory(cat);
            return ResponseEntity.ok(services);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Create new service
    @PostMapping
    public ResponseEntity<ServiceDTO> createService(@Valid @RequestBody ServiceDTO serviceDTO, 
                                                   @RequestParam Long providerId) {
        try {
            ServiceDTO createdService = serviceService.createService(serviceDTO, providerId);
            return ResponseEntity.ok(createdService);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Update existing service
    @PutMapping("/{serviceId}")
    public ResponseEntity<ServiceDTO> updateService(@PathVariable Long serviceId,
                                                   @Valid @RequestBody ServiceDTO serviceDTO,
                                                   @RequestParam Long providerId) {
        try {
            ServiceDTO updatedService = serviceService.updateService(serviceId, serviceDTO, providerId);
            return ResponseEntity.ok(updatedService);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Delete service (soft delete)
    @DeleteMapping("/{serviceId}")
    public ResponseEntity<Void> deleteService(@PathVariable Long serviceId,
                                            @RequestParam Long providerId) {
        try {
            serviceService.deleteService(serviceId, providerId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
