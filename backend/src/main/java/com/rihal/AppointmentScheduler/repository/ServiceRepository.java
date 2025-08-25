package com.rihal.AppointmentScheduler.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.rihal.AppointmentScheduler.model.ServiceModel;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceModel, Long> {

    // Find all services by provider
    List<ServiceModel> findByProvider_IdAndIsActiveTrue(Long providerId);

    // Find all active services
    List<ServiceModel> findByIsActiveTrue();

    // Find service by name and provider
    Optional<ServiceModel> findByNameAndProvider_IdAndIsActiveTrue(String name, Long providerId);

    // Find services by category
    List<ServiceModel> findByCategoryAndIsActiveTrue(ServiceModel.Category category);

    // Find services by provider and category
    List<ServiceModel> findByProvider_IdAndCategoryAndIsActiveTrue(Long providerId, ServiceModel.Category category);

    // Check if service name exists for provider
    boolean existsByNameAndProvider_IdAndIsActiveTrue(String name, Long providerId);

    // Find services with price range
    @Query("SELECT s FROM ServiceModel s WHERE s.price BETWEEN :minPrice AND :maxPrice AND s.isActive = true")
    List<ServiceModel> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    // Find services by duration range
    @Query("SELECT s FROM ServiceModel s WHERE s.durationMinutes BETWEEN :minDuration AND :maxDuration AND s.isActive = true")
    List<ServiceModel> findByDurationRange(@Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration);
}
