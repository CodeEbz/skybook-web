package com.skybook.service;

import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class PaymentProcessor {

    private final Random random = new Random();

    public boolean processPayment(double amount, String cardNumber) {
        try { Thread.sleep(500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        return random.nextInt(10) < 9;
    }
}
