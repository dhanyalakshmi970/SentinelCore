package com.sentinelcore.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key =
            Keys.secretKeyFor(
                    io.jsonwebtoken.SignatureAlgorithm.HS256
            );

    // Access token expires in 15 minutes
    private final long ACCESS_EXPIRATION =
            1000 * 60 * 15;

    // Refresh token expires in 7 days
    private final long REFRESH_EXPIRATION =
            1000 * 60 * 60 * 24 * 7;

    // Generate short-lived access token
    public String generateToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + ACCESS_EXPIRATION
                        )
                )
                .signWith(key)
                .compact();
    }

    // Generate long-lived refresh token
    public String generateRefreshToken(String username) {

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + REFRESH_EXPIRATION
                        )
                )
                .signWith(key)
                .compact();
    }

    // Extract username from JWT
    public String extractUsername(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Check whether token is valid
    public boolean isTokenValid(String token) {

        try {

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (JwtException e) {

            return false;
        }
    }
}