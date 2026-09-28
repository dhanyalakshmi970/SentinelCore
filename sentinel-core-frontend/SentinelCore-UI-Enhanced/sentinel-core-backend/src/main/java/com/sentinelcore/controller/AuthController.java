package com.sentinelcore.controller;

import com.sentinelcore.entity.PasswordResetToken;
import com.sentinelcore.repository.PasswordResetTokenRepository;

import com.sentinelcore.service.NotificationService;
import java.time.LocalDateTime;
import java.util.UUID;
import com.sentinelcore.dto.RegisterRequest;
import com.sentinelcore.entity.Role;
import com.sentinelcore.entity.User;
import com.sentinelcore.repository.RoleRepository;
import com.sentinelcore.repository.UserRepository;
import com.sentinelcore.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Set;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final NotificationService notificationService;

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> credentials) {
        System.out.println("LOGIN REQUEST RECEIVED");
        System.out.println("Credentials received: " + credentials);

        String usernameOrEmail =
                credentials.get("usernameOrEmail");

        String rawPassword =
                credentials.get("password");

        // Find user by username
        Optional<User> userOptional =
                userRepository.findByUsername(usernameOrEmail);

        // If username not found, try email
        if (userOptional.isEmpty()) {
            userOptional =
                    userRepository.findByEmail(usernameOrEmail);
        }

        // User not found
        if (userOptional.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username/email or password."
                    ));
        }

        User user = userOptional.get();

        // Debug information
        System.out.println(
                "Username found: " + user.getUsername()
        );

        System.out.println(
                "Email found: " + user.getEmail()
        );

        System.out.println(
                "Enabled: " + user.isEnabled()
        );

        // Check password
        boolean passwordMatches =
                passwordEncoder.matches(
                        rawPassword,
                        user.getPassword()
                );

        System.out.println(
                "Password matches: " + passwordMatches
        );

        // Wrong password
        if (!passwordMatches) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Invalid username/email or password."
                    ));
        }

        // Check account status
        if (!user.isEnabled()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Your account is disabled."
                    ));
        }

        // Generate access token
        String accessToken =
                jwtUtil.generateToken(user);

        // Generate refresh token
        String refreshToken =
                jwtUtil.generateRefreshToken(
                        user.getUsername()
                );

        // Successful login
        return ResponseEntity.ok(
                Map.of(
                        "accessToken",
                        accessToken,
                        "refreshToken",
                        refreshToken
                )
        );
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public Map<String, String> register(
            @Valid @RequestBody RegisterRequest request) {

        // Check username
        if (userRepository
                .findByUsername(request.getUsername())
                .isPresent()) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Check email
        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Get viewer role
        Role viewerRole =
                roleRepository
                        .findByName("ROLE_VIEWER")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "ROLE_VIEWER not found"
                                )
                        );

        // Create user
        User user =
                User.builder()
                        .username(request.getUsername())
                        .password(
                                passwordEncoder.encode(
                                        request.getPassword()
                                )
                        )
                        .email(request.getEmail())
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .enabled(true)
                        .roles(Set.of(viewerRole))
                        .build();

        // Save user
        userRepository.save(user);

        return Map.of(
                "message",
                "Account created successfully"
        );
    }

    // =========================
// FORGOT PASSWORD
// =========================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");

        // Check whether email is provided
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            "Email is required."
                    ));
        }

        // Find user by email
        Optional<User> userOptional =
                userRepository.findByEmail(email);

        // Check whether account exists
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "No account found with this email."
                    ));
        }

        User user = userOptional.get();

        // Delete any previous reset token
        passwordResetTokenRepository.findByUser(user)
                .ifPresent(passwordResetTokenRepository::delete);

        // Generate a new reset token
        String token = UUID.randomUUID().toString();

        // Create password reset token
        PasswordResetToken resetToken =
                PasswordResetToken.builder()
                        .token(token)
                        .user(user)
                        .expiryDate(
                                LocalDateTime.now().plusMinutes(15)
                        )
                        .build();

        // Save token in database
        passwordResetTokenRepository.save(resetToken);

        // Send password reset email
        notificationService.sendPasswordResetEmail(
                user.getEmail(),
                token
        );

        // Return success response
        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password reset link has been sent to your email."
                )
        );
    }
    // =========================
    // REFRESH ACCESS TOKEN
    // =========================
    @PostMapping("/refresh")
    public Map<String, String> refresh(
            @RequestBody Map<String, String> body) {

        String refreshToken =
                body.get("refreshToken");

        // Validate refresh token
        if (refreshToken == null ||
                !jwtUtil.isTokenValid(refreshToken)) {

            throw new RuntimeException(
                    "Invalid or expired refresh token"
            );
        }

        // Extract username
        String username =
                jwtUtil.extractUsername(refreshToken);

        // Find user
        User user =
                userRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        // Generate new access token
        String newAccessToken =
                jwtUtil.generateToken(user);

        return Map.of(
                "accessToken",
                newAccessToken
        );
    }

}