package com.skybook.controller;

import com.skybook.dto.AuthDTO;
import com.skybook.model.Passenger;
import com.skybook.repository.PassengerRepository;
import com.skybook.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PassengerRepository passengerRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(PassengerRepository passengerRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.passengerRepository = passengerRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO.LoginRequest request) {
        Passenger passenger = passengerRepository.findByEmail(request.getEmail()).orElse(null);

        if (passenger == null || !passwordEncoder.matches(request.getPassword(), passenger.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(passenger.getEmail(), passenger.getRole(), passenger.getId());
        return ResponseEntity.ok(new AuthDTO.AuthResponse(token, passenger.getRole(), passenger.getName(), passenger.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDTO.RegisterRequest request) {
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return ResponseEntity.badRequest().body("Invalid email format.");
        }
        if (request.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters.");
        }
        if (passengerRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already in use.");
        }

        Passenger passenger = new Passenger();
        passenger.setName(request.getName());
        passenger.setEmail(request.getEmail());
        passenger.setPassword(passwordEncoder.encode(request.getPassword()));
        passenger.setRole("PASSENGER");
        passenger.setPhoneNumber(request.getPhoneNumber());
        passenger.setAddress(request.getAddress());

        passengerRepository.save(passenger);
        return ResponseEntity.ok("Account created successfully.");
    }
}
