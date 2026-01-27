package com.hotel.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.hotel.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Finds all bookings for a specific user ID
    List<Booking> findByUserUserId(Long userId); 

    
    List<Booking> findByRoomRoomId(Long roomId);
}