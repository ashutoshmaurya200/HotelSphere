package com.hotel.dto;
import lombok.Data;

@Data
public class ForgotPasswordDTO {
    private String email;
    private String secretAnswer;
    private String newPassword;
}