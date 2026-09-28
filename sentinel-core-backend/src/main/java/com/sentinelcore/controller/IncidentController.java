package com.sentinelcore.controller;

import com.sentinelcore.dto.IncidentRequest;
import com.sentinelcore.entity.Incident;
import com.sentinelcore.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Incident> create(
            @RequestBody IncidentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping
    public List<Incident> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Incident getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}/assign")
    public Incident assign(
            @PathVariable Long id,
            @RequestParam String user) {

        return service.assign(id, user);
    }

    @PutMapping("/{id}/status")
    public Incident updateStatus(
            @PathVariable Long id,
            @RequestParam Incident.IncidentStatus status) {

        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}