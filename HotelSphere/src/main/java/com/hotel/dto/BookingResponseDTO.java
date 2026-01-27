package com.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingResponseDTO {

    private Long bookingId;
    private String userName;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String bookingStatus;
    private BigDecimal totalAmount;
}
