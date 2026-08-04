package com.sentinelcore.controller;

import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.service.AssetService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "https://localhost:5173")
@AllArgsConstructor
public class AssetController {

    private final AssetService assetService;
    @GetMapping("/find")
    public List<AssetDTO> findAssets(){
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public final AssetDTO getById(@PathVariable Long id){
        return assetService.getById(id);
    }

    @PostMapping("/add")
    public Asset createAsset(@RequestBody Asset asset) {
        return assetService.createAsset(asset);
    }

}
