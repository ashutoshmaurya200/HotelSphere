package com.hotel.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hotel.dto.BookingRequestDTO;
import com.hotel.entity.Booking;
import com.hotel.repository.BookingRepository;
import com.hotel.service.BookingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor // Automatically injects 'final' fields
public class BookingController {

    private final BookingService bookingService;
    private final BookingRepository bookingRepository; // Removed @Autowired, let Lombok handle it

    // 🔥 MERGED & SECURE CREATE METHOD
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO bookingRequest) {
        
        // 1. LOCK / CHECK: Is the room free?
        // Note: We check specifically for the Room ID and Dates requested
        boolean isOccupied = bookingRepository.existsByRoomIdAndDateRange(
            bookingRequest.getRoomId(),
            bookingRequest.getCheckInDate(),
            bookingRequest.getCheckOutDate()
        );

        if (isOccupied) {
            // ❌ Fail gracefully
            return ResponseEntity.status(409).body("Room is already booked for these dates!");
        }

        // 2. PROCEED: Logic is safe, call the service to save
        Booking newBooking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(newBooking);
    }

    // 2. GET ALL BOOKINGS
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 3. GET USER BOOKINGS 
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    // 4. CANCEL BOOKING
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok().build();
    }
}