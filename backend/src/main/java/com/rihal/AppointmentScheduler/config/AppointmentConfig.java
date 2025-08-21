package com.rihal.AppointmentScheduler.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "appointment")
public class AppointmentConfig {
    
    private int defaultCancellationLimitHours = 24;
    private int gracePeriodMinutes = 15;
    private boolean allowPastCancellations = false;
    
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
} 