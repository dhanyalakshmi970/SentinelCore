package com.sentinelcore.controller;


import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.dto.DashboardSummaryDTO;
import com.sentinelcore.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AssetController {

    private final AssetService assetService;

    @GetMapping("/getAll")
    public List<AssetDTO> getAllAssets() {
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public AssetDTO getAsset(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping
    public AssetDTO createAsset(@RequestBody AssetDTO dto) {
        return assetService.createAsset(dto);
    }

    @GetMapping("/dashboard/summary")
    public DashboardSummaryDTO getDashboardSummary() {
        return assetService.getDashboardSummary();
    }
}