package com.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
    private Long totalBookings;
    private BigDecimal totalRevenue;
    private Long activeBookings;
    private Long availableRooms;
}