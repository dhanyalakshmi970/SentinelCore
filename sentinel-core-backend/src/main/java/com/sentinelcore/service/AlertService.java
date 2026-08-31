package com.sentinelcore.service;

import com.sentinelcore.dto.AlertDTO;
import com.sentinelcore.entity.Alert;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AlertRepository;
import com.sentinelcore.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;
    private final AssetRepository assetRepository;
    private final NotificationService notificationService;
    private final TwilioSmsService twilioSmsService;


    public AlertDTO createAlert(
            Long assetId,
            String severity,
            String message) {

        // Find the asset
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found: " + assetId
                        )
                );


        // Create alert
        Alert alert = Alert.builder()
                .asset(asset)
                .severity(
                        Alert.AlertSeverity.valueOf(severity)
                )
                .message(message)
                .status(Alert.AlertStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();


        // Save alert
        Alert savedAlert = alertRepository.save(alert);


        // Send email and SMS for HIGH or CRITICAL alerts
        if (savedAlert.getSeverity()
                == Alert.AlertSeverity.CRITICAL
                ||
                savedAlert.getSeverity()
                        == Alert.AlertSeverity.HIGH) {

            // Send Email
            notificationService.sendAlertEmail(
                    "dhanyalakshmi970@gmail.com",
                    asset.getAssetName(),
                    savedAlert.getSeverity().name(),
                    savedAlert.getMessage()
            );


            // Send SMS
            twilioSmsService.sendSms(
                    "+919842349049",
                    "SentinelCore "
                            + savedAlert.getSeverity().name()
                            + " alert on "
                            + asset.getAssetName()
                            + ": "
                            + savedAlert.getMessage()
            );
        }


        return toDTO(savedAlert);
    }


    public AlertDTO resolveAlert(Long alertId) {

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alert not found: " + alertId
                        )
                );

        alert.setStatus(Alert.AlertStatus.RESOLVED);
        alert.setResolvedAt(LocalDateTime.now());

        return toDTO(alertRepository.save(alert));
    }


    public List<AlertDTO> getOpenAlerts() {

        return alertRepository
                .findByStatus(Alert.AlertStatus.OPEN)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    private AlertDTO toDTO(Alert alert) {

        return AlertDTO.builder()
                .id(alert.getId())
                .assetId(alert.getAsset().getId())
                .assetName(
                        alert.getAsset().getAssetName()
                )
                .severity(
                        alert.getSeverity().name()
                )
                .message(alert.getMessage())
                .status(
                        alert.getStatus().name()
                )
                .createdAt(alert.getCreatedAt())
                .resolvedAt(alert.getResolvedAt())
                .build();
    }
}