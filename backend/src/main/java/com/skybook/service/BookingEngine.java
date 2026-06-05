package com.skybook.service;

import com.skybook.model.Booking;
import com.skybook.model.Flight;
import com.skybook.model.Ticket;
import com.skybook.repository.BookingRepository;
import com.skybook.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class BookingEngine {

    private final SeatManager seatManager;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final ExecutorService executorService = Executors.newFixedThreadPool(10);

    public BookingEngine(SeatManager seatManager, BookingRepository bookingRepository, TicketRepository ticketRepository) {
        this.seatManager = seatManager;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
    }

    public Future<Integer> processBooking(int passengerId, Flight flight, int selectedSeat, String seatClass) {
        return executorService.submit(() -> {
            boolean success = seatManager.bookSpecificSeat(flight.getId(), selectedSeat);
            if (success) {
                Booking booking = new Booking();
                booking.setPassengerId(passengerId);
                booking.setFlightId(flight.getId());
                booking.setSeatNumber(selectedSeat);
                booking.setBookingTime(LocalDateTime.now());
                booking.setStatus("CONFIRMED");
                booking.setSeatClass(seatClass);

                Booking saved = bookingRepository.save(booking);

                Ticket ticket = new Ticket();
                ticket.setBookingId(saved.getId());
                ticket.setTicketNumber("TKT-" + flight.getFlightNumber() + "-" + System.currentTimeMillis() % 10000);
                ticket.setPricePaid(flight.getFare());
                ticketRepository.save(ticket);

                return saved.getId();
            }
            return -1;
        });
    }
}
