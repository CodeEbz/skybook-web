package com.skybook.service;

import com.skybook.model.Flight;
import com.skybook.repository.BookingRepository;
import com.skybook.repository.FlightRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SeatManager {

    private final FlightRepository flightRepository;
    private final BookingRepository bookingRepository;
    private final Map<Integer, Object> flightLocks = new HashMap<>();

    public SeatManager(FlightRepository flightRepository, BookingRepository bookingRepository) {
        this.flightRepository = flightRepository;
        this.bookingRepository = bookingRepository;
    }

    private Object getLockForFlight(int flightId) {
        synchronized (flightLocks) {
            return flightLocks.computeIfAbsent(flightId, k -> new Object());
        }
    }

    public boolean bookSpecificSeat(int flightId, int seatNumber) {
        Object lock = getLockForFlight(flightId);
        synchronized (lock) {
            Flight flight = flightRepository.findById(flightId).orElse(null);
            if (flight != null && flight.getAvailableSeats() > 0) {
                List<Integer> takenSeats = bookingRepository.findTakenSeatsByFlightId(flightId);
                if (!takenSeats.contains(seatNumber)) {
                    flight.setAvailableSeats(flight.getAvailableSeats() - 1);
                    flightRepository.save(flight);
                    return true;
                }
            }
        }
        return false;
    }

    public boolean releaseSeat(int flightId) {
        Object lock = getLockForFlight(flightId);
        synchronized (lock) {
            Flight flight = flightRepository.findById(flightId).orElse(null);
            if (flight != null) {
                flight.setAvailableSeats(flight.getAvailableSeats() + 1);
                flightRepository.save(flight);
                return true;
            }
        }
        return false;
    }

    public List<Integer> getAvailableSeatsList(int flightId) {
        List<Integer> takenSeats = bookingRepository.findTakenSeatsByFlightId(flightId);
        List<Integer> available = new ArrayList<>();
        for (int i = 1; i <= 300; i++) {
            if (!takenSeats.contains(i)) available.add(i);
        }
        return available;
    }
}
