package com.hotel.controller;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dto.PaymentRequestDTO;
import com.hotel.entity.Payment;
import com.hotel.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    /**
     * Step 1: Create a secure Order ID from Razorpay.
     * This is called by the frontend before the payment popup opens.
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        int amount = Integer.parseInt(data.get("amount").toString());

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100); 
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);

        // Return as a Map so Axios parses it as a JSON object automatically
        Map<String, Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("currency", order.get("currency"));
        response.put("amount", order.get("amount"));

        return ResponseEntity.ok(response);
    }

    /**
     * Step 2: Finalize payment in your database.
     * This is called after the Razorpay popup successfully completes.
     */
    @PostMapping("/pay")
    public ResponseEntity<Payment> makePayment(@RequestBody PaymentRequestDTO request) {
        // request should now include the razorpay_payment_id from the frontend
        Payment payment = paymentService.createPayment(
                request.getBookingId(),
                request.getAmount(),
                request.getPaymentMethod(),
                request.getTransactionId() // Pass the Razorpay Payment ID here
        );
        return ResponseEntity.ok(payment);
    }
}