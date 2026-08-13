package com.sentinelcore.controller;

import com.sentinelcore.dto.AlertDTO;
import com.sentinelcore.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {
    private final AlertService alertService;
    @GetMapping("/open")
    public List<AlertDTO> getOpenAlerts() {
        return alertService.getOpenAlerts();
    }
    @PostMapping
    public AlertDTO createAlert(@RequestParam Long assetId,
                                @RequestParam String severity,
                                @RequestParam String message) {
        return alertService.createAlert(assetId, severity, message);
    }
        @PutMapping("/{id}/resolve")
        public AlertDTO resolveAlert (@PathVariable Long id){
            return alertService.resolveAlert(id);
        }
    }
