package com.hotel.service;

import java.util.List;
import com.hotel.dto.BookingRequestDTO;
import com.hotel.entity.Booking;

public interface BookingService {
    Booking createBooking(BookingRequestDTO request);
    List<Booking> getAllBookings();
    List<Booking> getUserBookings(Long userId);
    void cancelBooking(Long bookingId);
}