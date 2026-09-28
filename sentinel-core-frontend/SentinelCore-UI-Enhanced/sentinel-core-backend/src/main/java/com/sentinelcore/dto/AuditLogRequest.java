package com.sentinelcore.dto;

import lombok.Data;

@Data
public class AuditLogRequest {

    private String username;
    private String action;
    private String resource;
    private String ipAddress;
    private String details;
}