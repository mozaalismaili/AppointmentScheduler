package com.rihal.AppointmentScheduler.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rihal.AppointmentScheduler.dto.UserDTO;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Transactional
    public User registerUser(UserDTO request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Hash the password before saving
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // Create user entity (role mapping is case-insensitive)
        String roleName = request.getRole() == null ? "CUSTOMER" : request.getRole().trim().toUpperCase();
        User user = new User(
            request.getEmail(),
            encodedPassword,
            request.getName(),
            User.Role.valueOf(roleName),
            request.getPhone()
        );

        User saved = userRepository.save(user);

        // Log notification of registration (DB only)
        notificationService.logSent(
            "USER_REGISTERED",
            com.rihal.AppointmentScheduler.model.NotificationLog.Channel.IN_APP,
            null,
            null,
            "Welcome to Appointment Scheduler",
            "Account created for " + saved.getEmail(),
            null
        );

        return saved;
    }

    public User login(String email, String password) {
        // Find user by email
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        
        // Verify password
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
} 