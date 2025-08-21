package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HolidayRepository extends JpaRepository<Holiday, Long> {

    List<Holiday> findByProviderId(Long providerId);

    List<Holiday> findByProviderIdAndDate(Long providerId, LocalDate date);

    @Query("SELECT h FROM Holiday h WHERE h.provider.id = :providerId AND h.date BETWEEN :startDate AND :endDate ORDER BY h.date")
    List<Holiday> findByProviderIdAndDateRange(@Param("providerId") Long providerId,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    @Query("SELECT h FROM Holiday h WHERE h.provider.id = :providerId AND h.date >= :currentDate ORDER BY h.date")
    List<Holiday> findUpcomingHolidaysByProvider(@Param("providerId") Long providerId,
                                                 @Param("currentDate") LocalDate currentDate);

    boolean existsByProviderIdAndDate(Long providerId, LocalDate date);
}
