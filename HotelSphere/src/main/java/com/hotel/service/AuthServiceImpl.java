package com.hotel.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hotel.dto.ForgotPasswordDTO;
import com.hotel.dto.JwtResponseDTO;
import com.hotel.dto.LoginRequestDTO;
import com.hotel.dto.RegisterRequestDTO;
import com.hotel.entity.User;
import com.hotel.repository.UserRepository;
import com.hotel.security.JwtUtil; // Make sure JwtUtil is in this package

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    
    public AuthServiceImpl(UserRepository userRepository, 
                           PasswordEncoder passwordEncoder, 
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public String register(RegisterRequestDTO request) {
        // 1. Check if user exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // 2. Create User
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // 3. Set Role (Default to USER if empty)
        if (request.getRole() == null || request.getRole().isEmpty()) {
            user.setRole("USER");
        } else {
            user.setRole(request.getRole());
        }
        user.setPhone(request.getPhone());
        
        user.setSecretQuestion(request.getSecretQuestion());
        user.setSecretAnswer(request.getSecretAnswer());

        userRepository.save(user);
        return "User registered successfully";
    }

    @Override
    public JwtResponseDTO login(LoginRequestDTO request) {
        // 1. Find User
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // 2. Check Password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // 3. Generate Token
        String token = jwtUtil.generateToken(user.getEmail());
        
        return new JwtResponseDTO(token, user.getUserId(), user.getFullName(), user.getRole());
    }
    
    public String resetPassword(ForgotPasswordDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the secret answer matches (Case insensitive is better for UX)
        if (user.getSecretAnswer() == null || 
                !user.getSecretAnswer().equalsIgnoreCase(request.getSecretAnswer())) {
                throw new RuntimeException("Incorrect secret answer!");
            }
        // Encrypt and save new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password reset successfully!";
    }
    
    
}