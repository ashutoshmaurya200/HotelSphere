package com.hotel.dto;

import lombok.Data;

@Data
public class RoomRequestDTO {
	private String roomNumber;
    private String floor;
    private String status;
    private Long roomTypeId;
}
