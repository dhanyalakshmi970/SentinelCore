package com.sentinelcore.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="alerts")
@Data
public class Alert {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private Long assetId;

    private Long alertType;
    private String severity;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}
