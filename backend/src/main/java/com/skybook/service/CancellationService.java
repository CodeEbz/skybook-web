package com.skybook.service;

import com.skybook.model.Booking;
import com.skybook.model.Flight;
import com.skybook.repository.BookingRepository;
import com.skybook.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class CancellationService {

    private final BookingRepository bookingRepository;
    private final FlightRepository flightRepository;
    private final SeatManager seatManager;

    public CancellationService(BookingRepository bookingRepository, FlightRepository flightRepository, SeatManager seatManager) {
        this.bookingRepository = bookingRepository;
        this.flightRepository = flightRepository;
        this.seatManager = seatManager;
    }

    public double cancelAndCalculateRefund(Booking booking) {
        if (booking == null || !"CONFIRMED".equals(booking.getStatus())) return 0.0;

        Flight flight = flightRepository.findById(booking.getFlightId()).orElse(null);
        if (flight == null) return 0.0;

        LocalDateTime departureTime = LocalDateTime.parse(
                flight.getDepartureTime().replace(" ", "T").substring(0, 19));
        LocalDateTime now = LocalDateTime.now();

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        seatManager.releaseSeat(flight.getId());

        long hoursBeforeDeparture = Duration.between(now, departureTime).toHours();
        if (hoursBeforeDeparture > 24) return flight.getFare() * 0.9;
        else if (hoursBeforeDeparture > 0) return flight.getFare() * 0.5;

        return 0.0;
    }
}
