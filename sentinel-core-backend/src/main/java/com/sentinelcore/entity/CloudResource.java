package com.sentinelcore.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "cloud_resources")
@Data
public class CloudResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_name")
    private String resourceName;

    private String provider;

    private String region;

    @Column(name = "resource_type")
    private String resourceType;

    private String status;

    @Column(name = "auto_scaling")
    private Boolean autoScaling;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}