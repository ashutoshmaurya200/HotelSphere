package com.hotel.dto;

import java.time.LocalDate;

import lombok.Data;

@Data

public class BookingServiceRequestDTO {
	   private Long bookingId;
	    private String roomNumber;    
	    private Long serviceId;     
	    private int quantity;       
	    private LocalDate serviceDate;
}
