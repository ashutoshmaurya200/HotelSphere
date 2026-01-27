package com.hotel.service;

import com.hotel.dto.JwtResponseDTO;
import com.hotel.dto.LoginRequestDTO;
import com.hotel.dto.RegisterRequestDTO;

public interface AuthService {
    String register(RegisterRequestDTO request);
    JwtResponseDTO login(LoginRequestDTO request);
}