package com.hotel.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class BookingServicesResponseDTO {
    private Long bookingServiceId;
    private String serviceName;
    private int quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
}
