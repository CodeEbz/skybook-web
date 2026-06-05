package com.skybook.controller;

import com.skybook.model.Booking;
import com.skybook.model.Passenger;
import com.skybook.repository.BookingRepository;
import com.skybook.repository.PassengerRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;

    public AdminController(BookingRepository bookingRepository, PassengerRepository passengerRepository) {
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/users")
    public List<Passenger> getAllUsers() {
        return passengerRepository.findAll();
    }
}
