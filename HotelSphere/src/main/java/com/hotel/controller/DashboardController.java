package com.hotel.controller;

import com.hotel.dto.DashboardDTO;
import com.hotel.entity.Booking;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardDTO> getDashboardStats() {
        List<Booking> allBookings = bookingRepository.findAll();

        // 1. Total Bookings
        long totalBookings = allBookings.size();

        // 2. Total Revenue 
        BigDecimal totalRevenue = allBookings.stream()
                .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Active Bookings 
        long activeBookings = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getBookingStatus()) || "PAID".equals(b.getBookingStatus()))
                .count();

        // 4. Available Rooms 
        long totalRooms = roomRepository.count();
        long availableRooms = totalRooms - activeBookings;
        if (availableRooms < 0) availableRooms = 0;

        return ResponseEntity.ok(new DashboardDTO(totalBookings, totalRevenue, activeBookings, availableRooms));
    }
}