package com.hotel.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import com.hotel.entity.Booking;
import com.hotel.entity.Payment;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.PaymentRepository;

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

        // 1. Create Payment Record
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(transactionId);
        payment.setPaymentDate(LocalDateTime.now());
        
        // 2.  LOGIC FIX: Add new payment to existing amountPaid
        BigDecimal currentPaid = booking.getAmountPaid() != null ? booking.getAmountPaid() : BigDecimal.ZERO;
        BigDecimal newTotalPaid = currentPaid.add(amount);
        booking.setAmountPaid(newTotalPaid);

        // 3. Update Status: Only CONFIRM if Total is fully paid
        // (Use compareTo: if newTotalPaid >= totalAmount)
        BigDecimal totalCost = booking.getTotalAmount() != null ? booking.getTotalAmount() : BigDecimal.ZERO;
        
        if (newTotalPaid.compareTo(totalCost) >= 0) {
            booking.setBookingStatus("CONFIRMED");
        } else {
            // If they paid some, but not all (e.g., partial payment), you might want to keep it PENDING or use "PARTIAL"
            // For now, keeping PENDING is safer if balance > 0
            if (!"CONFIRMED".equals(booking.getBookingStatus())) {
                 booking.setBookingStatus("PENDING");
            }
        }

        bookingRepository.save(booking); // Update booking with new balance
        return paymentRepository.save(payment); // Save transaction history
    }
    
   }