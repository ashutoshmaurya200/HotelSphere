package com.hotel.service;

import java.time.LocalDate;
import java.util.List;
import com.hotel.entity.Room;

public interface RoomService {
    
    
    List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, String roomType);
    
    // Keep your other methods...
    List<Room> getAllRooms();
    Room getRoomById(Long id);
    Room saveRoom(Room room);
    void deleteRoom(Long id);
}