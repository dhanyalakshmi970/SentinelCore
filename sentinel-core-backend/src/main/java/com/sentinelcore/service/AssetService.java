package com.sentinelcore.service;



import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.dto.DashboardSummaryDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AssetRepository;
import com.sentinelcore.repository.AssetSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;

    public List<AssetDTO> getAllAssets() {
        return assetRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AssetDTO getAssetById(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found: " + id));

        return toDTO(asset);
    }

    public AssetDTO createAsset(AssetDTO dto) {

        Asset asset = Asset.builder()
                .assetName(dto.getAssetName())
                .assetType(dto.getAssetType())
                .ipAddress(dto.getIpAddress())
                .cpuUsage(dto.getCpuUsage())
                .memoryUsage(dto.getMemoryUsage())
                .diskUsage(dto.getDiskUsage())
                .networkUsage(dto.getNetworkUsage())
                .status(Asset.AssetStatus.valueOf(dto.getStatus()))
                .build();

        return toDTO(assetRepository.save(asset));
    }

    public DashboardSummaryDTO getDashboardSummary() {

        List<Asset> all = assetRepository.findAll();

        long total = all.size();

        long online = all.stream()
                .filter(a -> a.getStatus() == Asset.AssetStatus.ONLINE)
                .count();

        long offline = all.stream()
                .filter(a -> a.getStatus() == Asset.AssetStatus.OFFLINE)
                .count();

        long critical = all.stream()
                .filter(a -> a.getStatus() == Asset.AssetStatus.CRITICAL)
                .count();

        double avgCpu = all.stream()
                .map(Asset::getCpuUsage)
                .filter(java.util.Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        double avgMem = all.stream()
                .map(Asset::getMemoryUsage)
                .filter(java.util.Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        double avgDisk = all.stream()
                .map(Asset::getDiskUsage)
                .filter(java.util.Objects::nonNull)
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        double uptime = total == 0
                ? 0
                : (double) online / total * 100;

        return DashboardSummaryDTO.builder()
                .totalAssets(total)
                .uptimePercentage(uptime)
                .onlineAssets(online)
                .offlineAssets(offline)
                .criticalAlerts(critical)
                .avgCpuUsage(avgCpu)
                .avgMemoryUsage(avgMem)
                .avgDiskUsage(avgDisk)
                .build();
    }
    private AssetDTO toDTO(Asset asset) {

        return AssetDTO.builder()
                .id(asset.getId())
                .assetName(asset.getAssetName())
                .assetType(asset.getAssetType())
                .ipAddress(asset.getIpAddress())
                .cpuUsage(asset.getCpuUsage())
                .memoryUsage(asset.getMemoryUsage())
                .diskUsage(asset.getDiskUsage())
                .networkUsage(asset.getNetworkUsage())
                .status(asset.getStatus().name())
                .build();
    }

    public List<Asset> searchAndFilter(
            String search,
            String status,
            String risk
    ) {

        Specification<Asset> specification =
                AssetSpecification.searchAssets(
                        search,
                        status,
                        risk
                );

        return assetRepository.findAll(specification);
    }
}