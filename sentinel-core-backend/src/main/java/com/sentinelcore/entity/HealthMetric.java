package com.sentinelcore.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name="health_metrics")
@Data
public class HealthMetric {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(name="asset_id")
    private Long assetId;

    @Column(name="cpu_usage")
    private Double cpuUsage;

    @Column(name = "memory_usage")
    private Double memoryUsage;

    @Column(name = "disk_usage")
    private Double diskUsage;

    @Column(name = "network_usage")
    private Double networkUsage;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

}
