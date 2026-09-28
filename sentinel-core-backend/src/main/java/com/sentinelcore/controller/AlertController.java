package com.sentinelcore.controller;

import com.sentinelcore.dto.AlertDTO;
import com.sentinelcore.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AlertController {

    private final AlertService alertService;

    // GET ALL ALERTS
    @GetMapping
    public List<AlertDTO> getAllAlerts() {
        return alertService.getAllAlerts();
    }

    // GET ONLY OPEN ALERTS
    @GetMapping("/open")
    public List<AlertDTO> getOpenAlerts() {
        return alertService.getOpenAlerts();
    }

    // CREATE ALERT
    @PostMapping
    public AlertDTO createAlert(
            @RequestParam Long assetId,
            @RequestParam String severity,
            @RequestParam String message) {

        return alertService.createAlert(
                assetId,
                severity,
                message
        );
    }

    // RESOLVE ALERT
    @PutMapping("/{id}/resolve")
    public AlertDTO resolveAlert(@PathVariable Long id) {
        return alertService.resolveAlert(id);
    }
}