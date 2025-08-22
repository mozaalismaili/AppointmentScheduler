package com.rihal.AppointmentScheduler.repository;

import com.rihal.AppointmentScheduler.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.Role role);
    
    // Helper method to find user by UUID (converted from Long ID)
    default Optional<User> findByUuid(UUID uuid) {
        try {
            // Extract the numeric part from UUID
            String uuidStr = uuid.toString();
            String numericPart = uuidStr.substring(uuidStr.lastIndexOf("-") + 1);
            Long id = Long.parseLong(numericPart);
            return findById(id);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}