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


    // ============================================================
    // CREATE ALERT
    // ============================================================

    public AlertDTO createAlert(
            Long assetId,
            String severity,
            String message) {

        // --------------------------------------------------------
        // Find asset
        // --------------------------------------------------------

        Asset asset = assetRepository
                .findById(assetId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Asset not found: " + assetId
                        )
                );


        // --------------------------------------------------------
        // Create alert
        // --------------------------------------------------------

        Alert alert = Alert.builder()
                .asset(asset)
                .severity(
                        Alert.AlertSeverity.valueOf(
                                severity.toUpperCase()
                        )
                )
                .message(message)
                .status(Alert.AlertStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();


        // --------------------------------------------------------
        // Save alert
        // --------------------------------------------------------

        Alert savedAlert =
                alertRepository.save(alert);


        // --------------------------------------------------------
        // Send notifications for HIGH / CRITICAL
        // --------------------------------------------------------

        if (
                savedAlert.getSeverity()
                        == Alert.AlertSeverity.CRITICAL
                        ||
                        savedAlert.getSeverity()
                                == Alert.AlertSeverity.HIGH
        ) {

            // Email

            notificationService.sendAlertEmail(
                    "dhanyalakshmi970@gmail.com",
                    asset.getAssetName(),
                    savedAlert.getSeverity().name(),
                    savedAlert.getMessage()
            );


            // SMS

            twilioSmsService.sendSms(
                    "+919842349049",
                    "SentinelCore "
                            + savedAlert
                            .getSeverity()
                            .name()
                            + " alert on "
                            + asset.getAssetName()
                            + ": "
                            + savedAlert.getMessage()
            );
        }


        return toDTO(savedAlert);
    }


    // ============================================================
    // GET ALL ALERTS
    // ============================================================

    public List<AlertDTO> getAllAlerts() {

        return alertRepository
                .findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET OPEN ALERTS
    // ============================================================


    public List<AlertDTO> getOpenAlerts() {

        return alertRepository
                .findByStatus(
                        Alert.AlertStatus.OPEN
                )
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }


    // ============================================================
    // RESOLVE ALERT
    // ============================================================

    public AlertDTO resolveAlert(
            Long alertId) {

        // --------------------------------------------------------
        // Find alert
        // --------------------------------------------------------

        Alert alert =
                alertRepository
                        .findById(alertId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Alert not found: "
                                                + alertId
                                )
                        );


        // --------------------------------------------------------
        // Change status
        // --------------------------------------------------------

        alert.setStatus(
                Alert.AlertStatus.RESOLVED
        );


        // --------------------------------------------------------
        // Set resolved time
        // --------------------------------------------------------

        alert.setResolvedAt(
                LocalDateTime.now()
        );


        // --------------------------------------------------------
        // Save changes
        // --------------------------------------------------------

        Alert savedAlert =
                alertRepository.save(alert);


        // --------------------------------------------------------
        // Return updated alert
        // --------------------------------------------------------

        return toDTO(savedAlert);
    }


    // ============================================================
    // CONVERT ENTITY → DTO
    // ============================================================

    private AlertDTO toDTO(
            Alert alert) {

        return AlertDTO.builder()

                .id(
                        alert.getId()
                )

                .assetId(
                        alert.getAsset().getId()
                )

                .assetName(
                        alert.getAsset().getAssetName()
                )

                .severity(
                        alert.getSeverity().name()
                )

                .message(
                        alert.getMessage()
                )

                .status(
                        alert.getStatus().name()
                )

                .createdAt(
                        alert.getCreatedAt()
                )

                .resolvedAt(
                        alert.getResolvedAt()
                )

                .build();
    }
}