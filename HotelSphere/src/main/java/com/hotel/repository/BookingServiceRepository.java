package com.hotel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel.entity.BookingService;

public interface BookingServiceRepository extends JpaRepository<BookingService, Long> {
    
  
    List<BookingService> findByBookingBookingId(Long bookingId);
}