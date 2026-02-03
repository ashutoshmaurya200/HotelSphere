package com.hotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Finds all bookings for a specific user ID
    List<Booking> findByUserUserId(Long userId); 

    
    List<Booking> findByRoomRoomId(Long roomId);
    
    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
            "WHERE b.room.roomId = :roomId " +
            "AND b.bookingStatus = 'CONFIRMED' " +
            "AND b.checkInDate < :checkOut " +
            "AND b.checkOutDate > :checkIn")
     boolean existsByRoomIdAndDateRange(@Param("roomId") Long roomId, 
                                        @Param("checkIn") LocalDate checkIn, 
                                        @Param("checkOut") LocalDate checkOut);
}