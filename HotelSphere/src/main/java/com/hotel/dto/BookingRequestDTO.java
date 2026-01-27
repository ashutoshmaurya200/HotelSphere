package com.hotel.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class BookingRequestDTO {
    private Long userId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String bookingStatus; // Optional
}