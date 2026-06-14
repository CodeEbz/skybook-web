package com.skybook;

import com.skybook.model.Flight;
import com.skybook.model.Passenger;
import com.skybook.repository.FlightRepository;
import com.skybook.repository.PassengerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(FlightRepository flightRepository, PassengerRepository passengerRepository, PasswordEncoder passwordEncoder) {
        this.flightRepository = flightRepository;
        this.passengerRepository = passengerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Passengers/Users if none exist
        if (passengerRepository.count() == 0) {
            System.out.println("No passengers found in the database. Seeding default accounts...");
            
            Passenger admin = new Passenger();
            admin.setName("System Admin");
            admin.setEmail("admin@skybook.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setPhoneNumber("+2348012345678");
            admin.setAddress("SkyBook Airlines Headquarters, Lagos");
            passengerRepository.save(admin);

            Passenger user = new Passenger();
            user.setName("John Doe");
            user.setEmail("user@skybook.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole("PASSENGER");
            user.setPhoneNumber("+2348098765432");
            user.setAddress("45 Allen Avenue, Ikeja, Lagos");
            passengerRepository.save(user);

            System.out.println("User seeding complete. Admin: admin@skybook.com (admin123), User: user@skybook.com (user123)");
        }

        // 2. Seed Flights if none exist
        if (flightRepository.count() == 0) {
            System.out.println("No flights found in the database. Seeding default flights...");

            Flight f1 = new Flight();
            f1.setFlightNumber("NG101");
            f1.setOrigin("Lagos (LOS)");
            f1.setDestination("Abuja (ABV)");
            f1.setDepartureTime("2026-07-20T08:00:00");
            f1.setFare(75000.00);
            f1.setAvailableSeats(120);
            f1.setFlightType("DOMESTIC");
            flightRepository.save(f1);

            Flight f2 = new Flight();
            f2.setFlightNumber("NG102");
            f2.setOrigin("Abuja (ABV)");
            f2.setDestination("Lagos (LOS)");
            f2.setDepartureTime("2026-07-20T12:00:00");
            f2.setFare(75000.00);
            f2.setAvailableSeats(120);
            f2.setFlightType("DOMESTIC");
            flightRepository.save(f2);

            Flight f3 = new Flight();
            f3.setFlightNumber("NG201");
            f3.setOrigin("Lagos (LOS)");
            f3.setDestination("London (LHR)");
            f3.setDepartureTime("2026-07-21T23:30:00");
            f3.setFare(950000.00);
            f3.setAvailableSeats(250);
            f3.setFlightType("INTERNATIONAL");
            flightRepository.save(f3);

            Flight f4 = new Flight();
            f4.setFlightNumber("NG202");
            f4.setOrigin("London (LHR)");
            f4.setDestination("Lagos (LOS)");
            f4.setDepartureTime("2026-07-22T10:15:00");
            f4.setFare(1100000.00);
            f4.setAvailableSeats(250);
            f4.setFlightType("INTERNATIONAL");
            flightRepository.save(f4);

            Flight f5 = new Flight();
            f5.setFlightNumber("NG301");
            f5.setOrigin("Abuja (ABV)");
            f5.setDestination("New York (JFK)");
            f5.setDepartureTime("2026-07-23T22:00:00");
            f5.setFare(1400000.00);
            f5.setAvailableSeats(180);
            f5.setFlightType("INTERNATIONAL");
            flightRepository.save(f5);

            Flight f6 = new Flight();
            f6.setFlightNumber("NG401");
            f6.setOrigin("Lagos (LOS)");
            f6.setDestination("Enugu (ENU)");
            f6.setDepartureTime("2026-07-24T09:45:00");
            f6.setFare(65000.00);
            f6.setAvailableSeats(90);
            f6.setFlightType("DOMESTIC");
            flightRepository.save(f6);

            System.out.println("Flight seeding complete.");
        }
    }
}
