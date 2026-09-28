package com.sentinelcore.controller;

import com.sentinelcore.dto.AuditLogRequest;
import com.sentinelcore.entity.AuditLog;
import com.sentinelcore.service.AuditLogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin
public class AuditLogController {

    private final AuditLogService service;

    public AuditLogController(AuditLogService service) {
        this.service = service;
    }

    @PostMapping
    public AuditLog create(@RequestBody AuditLogRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<AuditLog> getAll() {
        return service.getAll();
    }

    @GetMapping("/user/{username}")
    public List<AuditLog> getByUsername(
            @PathVariable String username) {
        return service.getByUsername(username);
    }
}