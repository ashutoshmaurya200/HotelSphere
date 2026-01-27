package com.hotel.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotel.dto.RoomRequestDTO;
import com.hotel.entity.Booking;
import com.hotel.entity.BookingService;
import com.hotel.entity.Payment;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.BookingServiceRepository;
import com.hotel.repository.PaymentRepository;
import com.hotel.repository.RoomRepository; // ✅ Make sure this is imported
import com.hotel.repository.RoomTypeRepository;
import com.hotel.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    
  
    private final RoomRepository roomRepository; 
    
    private final RoomTypeRepository roomTypeRepository;
    private final BookingRepository bookingRepository;
    private final BookingServiceRepository bookingServiceRepository;
    private final PaymentRepository paymentRepository;

  
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        
        List<Booking> bookings = bookingRepository.findByRoomRoomId(id);
        
        for (Booking booking : bookings) {
            Long bookingId = booking.getBookingId();

            List<BookingService> services = bookingServiceRepository.findByBookingBookingId(bookingId);
            if (!services.isEmpty()) {
                bookingServiceRepository.deleteAll(services);
            }

            List<Payment> payments = paymentRepository.findByBookingBookingId(bookingId);
            if (!payments.isEmpty()) {
                paymentRepository.deleteAll(payments);
            }
        }

        if (!bookings.isEmpty()) {
            bookingRepository.deleteAll(bookings);
        }

        // This works now because roomRepository is declared above
        roomRepository.deleteById(id);
        
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody RoomRequestDTO dto) {
        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found"));

        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber());
        room.setFloor(dto.getFloor());
        room.setStatus(dto.getStatus());
        room.setRoomType(roomType);
        return ResponseEntity.ok(roomRepository.save(room));
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return ResponseEntity.ok(room);
    }
    
    // 🔥 FIX 2: Removed duplicate @GetMapping("/available")
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam("checkIn") String checkInStr,
            @RequestParam("checkOut") String checkOutStr,
            @RequestParam(value = "roomType", required = false) String roomType
    ) {
        LocalDate checkIn = LocalDate.parse(checkInStr);
        LocalDate checkOut = LocalDate.parse(checkOutStr);

        List<Room> rooms = roomService.getAvailableRooms(checkIn, checkOut, roomType);

        return ResponseEntity.ok(rooms);
    }
}