package com.hotel.service;

import java.math.BigDecimal;

import com.hotel.entity.Payment;

public interface PaymentService {

	Payment createPayment(Long bookingId, BigDecimal amount, String paymentMethod, String transactionId);
}
