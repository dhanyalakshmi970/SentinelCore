package com.sentinelcore.controller;

import com.sentinelcore.entity.User;
import com.sentinelcore.repository.UserRepository;
import com.sentinelcore.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;


    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> credentials) {

        // Get username and password from request
        String username = credentials.get("username");
        String rawPassword = credentials.get("password");


        // Find user from database
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("Invalid credentials"));


        // Check password using BCrypt
        if (!passwordEncoder.matches(
                rawPassword,
                user.getPassword())) {

            throw new RuntimeException("Invalid credentials");
        }


        // Generate access token
        String accessToken =
                jwtUtil.generateToken(username);


        // Generate refresh token
        String refreshToken =
                jwtUtil.generateRefreshToken(username);


        // Return both tokens
        return Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        );
    }


    // =========================
    // REFRESH TOKEN
    // =========================

    @PostMapping("/refresh")
    public Map<String, String> refresh(
            @RequestBody Map<String, String> body) {

        // Get refresh token from request
        String refreshToken =
                body.get("refreshToken");


        // Check whether refresh token is valid
        if (!jwtUtil.isTokenValid(refreshToken)) {

            throw new RuntimeException(
                    "Invalid or expired refresh token"
            );
        }


        // Extract username from refresh token
        String username =
                jwtUtil.extractUsername(refreshToken);


        // Generate new access token
        String newAccessToken =
                jwtUtil.generateToken(username);


        // Return new access token
        return Map.of(
                "accessToken",
                newAccessToken
        );
    }
}