package com.skybook;

import com.skybook.model.Passenger;
import com.skybook.repository.PassengerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigration implements CommandLineRunner {

    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigration(PassengerRepository passengerRepository, PasswordEncoder passwordEncoder) {
        this.passengerRepository = passengerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        List<Passenger> passengers = passengerRepository.findAll();
        for (Passenger p : passengers) {
            // If password is not already BCrypt encoded (BCrypt hashes start with $2a$)
            if (!p.getPassword().startsWith("$2a$")) {
                p.setPassword(passwordEncoder.encode(p.getPassword()));
                passengerRepository.save(p);
            }
        }
        System.out.println("Password migration complete.");
    }
}
