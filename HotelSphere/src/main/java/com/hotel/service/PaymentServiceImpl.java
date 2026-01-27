package com.hotel.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.hotel.entity.Booking;
import com.hotel.entity.Payment;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.PaymentRepository;
import com.hotel.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

	private final PaymentRepository paymentRepository;
	private final BookingRepository bookingRepository;

	public PaymentServiceImpl(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
		this.paymentRepository = paymentRepository;
		this.bookingRepository = bookingRepository;
	}

	@Override
	public Payment createPayment(Long bookingId, BigDecimal amount, String paymentMethod, String transactionId) {
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

		Payment payment = new Payment();
		payment.setBooking(booking);
		payment.setAmount(amount);
		payment.setPaymentMethod(paymentMethod);
		payment.setTransactionId(transactionId);
		payment.setPaymentDate(LocalDateTime.now());

		// 3. Update the Booking status to CONFIRMED
		booking.setBookingStatus("CONFIRMED");
		bookingRepository.save(booking);

		// 4. Save the payment record
		return paymentRepository.save(payment);
	}
}