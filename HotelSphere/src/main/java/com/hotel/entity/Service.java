package com.hotel.entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@Entity
@Table(name = "services")
public class Service {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long serviceId;

 private String name;
 private String description;
 private BigDecimal price;
}
