package com.hotel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JwtResponseDTO {

    private String token;
    private Long userId;
    private String fullName;
    private String role;

    
    public JwtResponseDTO(String token, Long userId, String fullName, String role) {
        this.token = token;
        this.userId = userId;
        this.fullName = fullName;
        this.role = role;
    }
}