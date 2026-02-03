package com.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String role;
    
    private String secretQuestion;
    private String secretAnswer;
}