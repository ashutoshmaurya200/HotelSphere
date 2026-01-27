package com.hotel.service;

import com.hotel.dto.BookingServiceRequestDTO;
import com.hotel.entity.BookingService;

public interface BookingServicesManagerService {
    BookingService addServiceToBooking(BookingServiceRequestDTO request);
}
