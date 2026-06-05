package com.skybook.controller;

import com.skybook.dto.BookingDTO;
import com.skybook.model.Booking;
import com.skybook.model.Flight;
import com.skybook.repository.BookingRepository;
import com.skybook.repository.FlightRepository;
import com.skybook.service.BookingEngine;
import com.skybook.service.CancellationService;
import com.skybook.service.PaymentProcessor;
import com.skybook.service.SeatManager;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingEngine bookingEngine;
    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final CancellationService cancellationService;
    private final PaymentProcessor paymentProcessor;
    private final SeatManager seatManager;

    public BookingController(BookingEngine bookingEngine, BookingRepository bookingRepository,
                             FlightRepository flightRepository, CancellationService cancellationService,
                             PaymentProcessor paymentProcessor, SeatManager seatManager) {
        this.bookingEngine = bookingEngine;
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.cancellationService = cancellationService;
        this.paymentProcessor = paymentProcessor;
        this.seatManager = seatManager;
    }

    // Get logged-in user's bookings
    @GetMapping("/my")
    public List<Booking> getMyBookings(Authentication auth) {
        int userId = (int) auth.getCredentials();
        return bookingRepository.findByPassengerIdOrderByBookingTimeDesc(userId);
    }

    // Get available seats for a flight
    @GetMapping("/seats/{flightId}")
    public List<Integer> getAvailableSeats(@PathVariable int flightId) {
        return seatManager.getAvailableSeatsList(flightId);
    }

    // Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO dto, Authentication auth) {
        int userId = (int) auth.getCredentials();

        Flight flight = flightRepository.findById(dto.getFlightId()).orElse(null);
        if (flight == null) return ResponseEntity.badRequest().body("Flight not found.");
        if (flight.getAvailableSeats() <= 0) return ResponseEntity.badRequest().body("No seats available.");

        boolean paid = paymentProcessor.processPayment(flight.getFare(), dto.getCardNumber());
        if (!paid) return ResponseEntity.badRequest().body("Payment declined. Please check your card details.");

        try {
            Future<Integer> result = bookingEngine.processBooking(userId, flight, dto.getSeatNumber(), dto.getSeatClass());
            int bookingId = result.get();
            if (bookingId != -1) {
                return ResponseEntity.ok(Map.of("bookingId", bookingId, "message", "Booking confirmed!"));
            }
            return ResponseEntity.badRequest().body("Seat already taken. Please select another seat.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Booking failed: " + e.getMessage());
        }
    }

    // Cancel a booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable int id, Authentication auth) {
        int userId = (int) auth.getCredentials();
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) return ResponseEntity.notFound().build();
        if (booking.getPassengerId() != userId) return ResponseEntity.status(403).body("Not your booking.");

        double refund = cancellationService.cancelAndCalculateRefund(booking);
        return ResponseEntity.ok(Map.of("refund", refund, "message", "Booking cancelled."));
    }
}
