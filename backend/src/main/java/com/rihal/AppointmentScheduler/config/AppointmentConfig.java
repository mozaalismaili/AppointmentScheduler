package com.rihal.AppointmentScheduler.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "appointment")
public class AppointmentConfig {
    
    private int defaultCancellationLimitHours = 24;
    private int gracePeriodMinutes = 15;
    private boolean allowPastCancellations = false;
    private String defaultProviderUuid = "00000000-0000-0000-0000-000000000001";
    private Long defaultProviderNumericId = 1L;
    private int defaultSlotMinutes = 30;
    
    // Getters and Setters
    public int getDefaultCancellationLimitHours() {
        return defaultCancellationLimitHours;
    }
    
    public void setDefaultCancellationLimitHours(int defaultCancellationLimitHours) {
        this.defaultCancellationLimitHours = defaultCancellationLimitHours;
    }
    
    public int getGracePeriodMinutes() {
        return gracePeriodMinutes;
    }
    
    public void setGracePeriodMinutes(int gracePeriodMinutes) {
        this.gracePeriodMinutes = gracePeriodMinutes;
    }
    
    public boolean isAllowPastCancellations() {
        return allowPastCancellations;
    }
    
    public void setAllowPastCancellations(boolean allowPastCancellations) {
        this.allowPastCancellations = allowPastCancellations;
    }

    public String getDefaultProviderUuid() {
        return defaultProviderUuid;
    }

    public void setDefaultProviderUuid(String defaultProviderUuid) {
        this.defaultProviderUuid = defaultProviderUuid;
    }

    public Long getDefaultProviderNumericId() {
        return defaultProviderNumericId;
    }

    public void setDefaultProviderNumericId(Long defaultProviderNumericId) {
        this.defaultProviderNumericId = defaultProviderNumericId;
    }

    public int getDefaultSlotMinutes() {
        return defaultSlotMinutes;
    }

    public void setDefaultSlotMinutes(int defaultSlotMinutes) {
        this.defaultSlotMinutes = defaultSlotMinutes;
    }
} 