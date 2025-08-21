package com.rihal.AppointmentScheduler.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String phone;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    private List<Availability> availabilities;

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    private List<Holiday> holidays;

    public enum Role {
        CUSTOMER, PROVIDER, ADMIN
    }

    // Constructors
    public User() {}

    public User(String email, String passwordHash, String name, Role role, String phone) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.role = role;
        this.phone = phone;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id)
    { this.id = id;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Availability> getAvailabilities() {
        return availabilities;
    }
    public void setAvailabilities(List<Availability> availabilities) {
        this.availabilities = availabilities;
    }
    public List<Holiday> getHolidays() {
        return holidays;
    }
    public void setHolidays(List<Holiday> holidays) {
        this.holidays = holidays;
    }
}
