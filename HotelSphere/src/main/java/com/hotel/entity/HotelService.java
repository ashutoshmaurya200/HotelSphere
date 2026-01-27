package com.hotel.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "services")
public class HotelService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceId;  

    private String name;     
    private String description;
    private BigDecimal price;

    @OneToMany(mappedBy = "service")
    @JsonIgnore
    private List<BookingService> bookingServices;
}