package com.skybook.controller;

import com.skybook.model.Passenger;
import com.skybook.repository.PassengerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileController(PassengerRepository passengerRepository, PasswordEncoder passwordEncoder) {
        this.passengerRepository = passengerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<Passenger> getProfile(Authentication auth) {
        int userId = (int) auth.getCredentials();
        return passengerRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, Authentication auth) {
        int userId = (int) auth.getCredentials();
        Passenger passenger = passengerRepository.findById(userId).orElse(null);
        if (passenger == null) return ResponseEntity.notFound().build();

        if (updates.containsKey("name")) passenger.setName(updates.get("name"));
        if (updates.containsKey("phoneNumber")) passenger.setPhoneNumber(updates.get("phoneNumber"));
        if (updates.containsKey("address")) passenger.setAddress(updates.get("address"));
        if (updates.containsKey("password") && !updates.get("password").isBlank()) {
            passenger.setPassword(passwordEncoder.encode(updates.get("password")));
        }

        passengerRepository.save(passenger);
        return ResponseEntity.ok("Profile updated successfully.");
    }
}
