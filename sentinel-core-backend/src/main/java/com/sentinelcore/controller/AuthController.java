package com.sentinelcore.controller;

import com.sentinelcore.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> credentials) {

        // Replace with real user lookup + password check against the database
        String username = credentials.get("username");
        String password = credentials.get("password");

        if ("admin".equals(username) &&
                "admin123".equals(password)) {

            String token = jwtUtil.generateToken(username);

            return Map.of("token", token);
        }

        throw new RuntimeException("Invalid credentials");
    }
}