package com.hotel.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit; // 🔥 Import for calculating days
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hotel.entity.Booking;
import com.hotel.entity.BookingService;
import com.hotel.entity.HotelService;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.BookingServiceRepository;
import com.hotel.repository.ServiceRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class BookingServiceController {

    private final ServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final BookingServiceRepository bookingServiceRepository;

    // 1. Get All Services
    @GetMapping
    public ResponseEntity<List<HotelService>> getAllServices() {
        return ResponseEntity.ok(serviceRepository.findAll());
    }

    // 2. Create Service 
    @PostMapping("/create")
    public ResponseEntity<HotelService> createService(@RequestBody HotelService service) {
        if(service.getName() == null || service.getPrice() == null) {
            throw new RuntimeException("Name and Price are required");
        }
        return ResponseEntity.ok(serviceRepository.save(service));
    }

    // 3. Add Service to Booking method
    @PostMapping("/add-to-booking")
    public ResponseEntity<BookingService> addServiceToBooking(
            @RequestParam Long bookingId,
            @RequestParam Long serviceId,
            @RequestParam Integer quantity
    ) {
        // Fetch Entities
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        HotelService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        // Calculate Service Cost
        BigDecimal servicePrice = service.getPrice();
        BigDecimal totalServiceCost = servicePrice.multiply(BigDecimal.valueOf(quantity));

        // Save the New BookingService Link
        BookingService bookingService = new BookingService();
        bookingService.setBooking(booking);
        bookingService.setService(service);
        bookingService.setQuantity(quantity);
        bookingService.setPricePerUnit(servicePrice);
        bookingService.setTotalPrice(totalServiceCost);
        bookingService.setServiceDate(LocalDate.now());
        
        // Save first so it's included in the recalculation below
        BookingService savedService = bookingServiceRepository.save(bookingService);

        //  RECALCULATE GRAND TOTAL 
        updateBookingTotalAmount(booking);

        return ResponseEntity.ok(savedService);
    }

 
    private void updateBookingTotalAmount(Booking booking) {
        
        // 1. Calculate Room Cost 
        BigDecimal roomPricePerNight = booking.getRoom().getRoomType().getBasePricePerNight();
        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        if (nights < 1) nights = 1; // Minimum 1 night
        
        BigDecimal totalRoomCost = roomPricePerNight.multiply(BigDecimal.valueOf(nights));

        // 2. Calculate Services Cost 
        List<BookingService> allServices = bookingServiceRepository.findByBookingBookingId(booking.getBookingId());
        
        BigDecimal totalServicesCost = BigDecimal.ZERO;
        for (BookingService s : allServices) {
            totalServicesCost = totalServicesCost.add(s.getTotalPrice());
        }

        // 3. Set Grand Total
        booking.setTotalAmount(totalRoomCost.add(totalServicesCost));
        bookingRepository.save(booking);
    }
}