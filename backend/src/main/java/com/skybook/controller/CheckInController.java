package com.skybook.controller;

import com.skybook.model.Booking;
import com.skybook.model.Flight;
import com.skybook.repository.BookingRepository;
import com.skybook.repository.FlightRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkin")
public class CheckInController {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;

    public CheckInController(BookingRepository bookingRepository, FlightRepository flightRepository) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<?> findBooking(@PathVariable int bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return ResponseEntity.notFound().build();

        if ("CANCELLED".equals(booking.getStatus()))
            return ResponseEntity.badRequest().body("This booking has been cancelled.");
        if ("CHECKED_IN".equals(booking.getStatus()))
            return ResponseEntity.badRequest().body("Already checked in.");

        Flight flight = flightRepository.findById(booking.getFlightId()).orElse(null);
        return ResponseEntity.ok(Map.of(
                "bookingId", booking.getId(),
                "seatNumber", booking.getSeatNumber(),
                "status", booking.getStatus(),
                "flightNumber", flight != null ? flight.getFlightNumber() : "Unknown",
                "origin", flight != null ? flight.getOrigin() : "",
                "destination", flight != null ? flight.getDestination() : ""
        ));
    }

    @PutMapping("/{bookingId}/confirm")
    public ResponseEntity<?> confirmCheckIn(@PathVariable int bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) return ResponseEntity.notFound().build();

        booking.setStatus("CHECKED_IN");
        bookingRepository.save(booking);
        return ResponseEntity.ok("Check-in successful! Your boarding pass has been generated.");
    }
}
