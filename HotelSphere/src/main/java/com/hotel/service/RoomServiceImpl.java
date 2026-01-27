package com.hotel.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.hotel.entity.Room;
import com.hotel.repository.RoomRepository;

@Service
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    
    public RoomServiceImpl(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, String roomType) {
        List<Room> availableRooms = roomRepository.findAvailableRooms(checkIn, checkOut);

        if (roomType != null && !roomType.isEmpty()) {
            return availableRooms.stream()
            		.filter(room -> room.getRoomType().getName().toLowerCase()
                            .contains(roomType.toLowerCase())) 
            .collect(Collectors.toList());
        }
        return availableRooms;
    }

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

	@Override
	public Room saveRoom(Room room) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void deleteRoom(Long id) {
		// TODO Auto-generated method stub
		
	}
}