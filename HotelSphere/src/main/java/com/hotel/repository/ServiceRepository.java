package com.hotel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hotel.entity.HotelService;

@Repository
public interface ServiceRepository extends JpaRepository<HotelService, Long> {
}
