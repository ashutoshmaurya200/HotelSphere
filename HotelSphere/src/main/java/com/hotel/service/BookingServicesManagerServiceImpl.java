package com.hotel.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.hotel.dto.BookingServiceRequestDTO;
import com.hotel.entity.Booking;
import com.hotel.entity.BookingService;
import com.hotel.entity.HotelService;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.BookingServiceRepository;
import com.hotel.repository.ServiceRepository;

@Service
public class BookingServicesManagerServiceImpl implements BookingServicesManagerService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final BookingServiceRepository bookingServiceRepository;

 
    public BookingServicesManagerServiceImpl(BookingRepository bookingRepository,
                                             ServiceRepository serviceRepository,
                                             BookingServiceRepository bookingServiceRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.bookingServiceRepository = bookingServiceRepository;
    }

    @Override
    public BookingService addServiceToBooking(BookingServiceRequestDTO request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        HotelService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        BigDecimal pricePerUnit = service.getPrice();
        BigDecimal totalPrice = pricePerUnit.multiply(BigDecimal.valueOf(request.getQuantity()));

        BookingService bookingService = new BookingService();
        bookingService.setBooking(booking);
        bookingService.setQuantity(request.getQuantity());
        bookingService.setService(service);
        bookingService.setPricePerUnit(pricePerUnit);
        bookingService.setTotalPrice(totalPrice);
        bookingService.setServiceDate(request.getServiceDate());

        return bookingServiceRepository.save(bookingService);
    }
}