package com.skybook.repository;

import com.skybook.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByPassengerIdOrderByBookingTimeDesc(int passengerId);

    @Query("SELECT b.seatNumber FROM Booking b WHERE b.flightId = :flightId AND b.status IN ('CONFIRMED', 'CHECKED_IN')")
    List<Integer> findTakenSeatsByFlightId(int flightId);
}
