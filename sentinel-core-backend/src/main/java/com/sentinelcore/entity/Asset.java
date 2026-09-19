package com.sentinelcore.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String assetName;

    @Column(nullable = false)
    private String assetType;

    @Column(nullable = false, unique = true)
    private String ipAddress;

    private Double cpuUsage;

    private Double memoryUsage;

    private Double diskUsage;

    private Double networkUsage;

    @Column(name = "risk")
    private String risk;

    @Enumerated(EnumType.STRING)
    private AssetStatus status;

    public enum AssetStatus {
        ONLINE,
        WARNING,
        CRITICAL,
        OFFLINE
    }
}