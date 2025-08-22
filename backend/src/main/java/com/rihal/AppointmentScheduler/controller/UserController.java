package com.rihal.AppointmentScheduler.controller;

import com.rihal.AppointmentScheduler.dto.UserDTO;
import com.rihal.AppointmentScheduler.model.User;
import com.rihal.AppointmentScheduler.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            Map<String, String> errorMap = new HashMap<>();
            errorMap.put("error", "Email already exists");
            return ResponseEntity.badRequest().body(errorMap);
        }

        // Map DTO to entity
        String roleName = request.getRole() == null ? "CUSTOMER" : request.getRole().trim().toUpperCase();
        User user = new User(
                request.getEmail(),
                request.getPassword(), // For now plain; should hash before storing
                request.getName(),
                User.Role.valueOf(roleName),
                request.getPhone()
        );

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
}
