package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    private String roomNumber;
    private String floor;
    private String status;

    
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType; 
}