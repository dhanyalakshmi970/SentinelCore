package com.sentinelcore.service;

import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {
    @Autowired
    private AssetRepository assetRepository;

    @Override
    public List<AssetDTO> getAllAssets(){
        return assetRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public AssetDTO getById(Long id){
        Asset asset=assetRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Asset not found"));
        return toDTO(asset);
    }


    public Asset createAsset(Asset a){
        Asset asset = Asset.builder()
                .assetName(a.getAssetName())
                .assetType(a.getAssetType())
                .ipAddress(a.getIpAddress())
                .location(a.getLocation())
                .cpuUsage(a.getCpuUsage())
                .memoryUsage(a.getMemoryUsage())
                .disk(a.getDisk())
                .network(a.getNetwork())
                .status(a.getStatus())
                .createdDate(LocalDateTime.now())
                .build();
        return assetRepository.save(asset);
    }


    private AssetDTO toDTO(Asset asset) {
        AssetDTO dto=new AssetDTO();
        dto.setId(asset.getId());
        dto.setAssetName(asset.getAssetName());
        dto.setStatus(asset.getStatus());
        dto.setAssetType(asset.getAssetType());

        return dto;
    }


}
