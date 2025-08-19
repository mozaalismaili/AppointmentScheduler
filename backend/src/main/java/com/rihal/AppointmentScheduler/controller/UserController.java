package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.dto.UserDTO;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Map DTO to entity
        User user = new User(
                request.getEmail(),
                request.getPassword(), // For now plain; should hash before storing
                request.getName(),
                User.Role.valueOf(request.getRole()),
                request.getPhone()
        );

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
