package com.sentinelcore.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardSummaryDTO {

    private Long totalAssets;

    private Double uptimePercentage;

    private Long onlineAssets;

    private Long offlineAssets;

    private Long criticalAlerts;

    private Double avgCpuUsage;

    private Double avgMemoryUsage;

    private Double avgDiskUsage;
}