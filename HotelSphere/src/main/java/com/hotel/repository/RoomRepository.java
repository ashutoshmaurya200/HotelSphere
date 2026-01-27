package com.hotel.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {

  
    List<Room> findByStatus(String status);

    
    @Query("SELECT r FROM Room r WHERE r.roomId NOT IN (" +
           "  SELECT b.room.roomId FROM Booking b " +
           "  WHERE b.bookingStatus <> 'CANCELLED' " +
           "  AND ((b.checkInDate <= :checkOut) AND (b.checkOutDate >= :checkIn))" +
           ")")
    List<Room> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn, 
        @Param("checkOut") LocalDate checkOut
    );
}