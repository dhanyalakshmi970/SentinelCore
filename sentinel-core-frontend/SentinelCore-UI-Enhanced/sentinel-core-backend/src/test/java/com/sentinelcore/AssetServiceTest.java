package com.sentinelcore;

import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.dto.DashboardSummaryDTO;
import com.sentinelcore.entity.Asset;
import com.sentinelcore.repository.AssetRepository;
import com.sentinelcore.service.AssetService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private AssetService assetService;


    @Test
    void getAllAssets_ShouldReturnAllAssets() {

        Asset asset = Asset.builder()
                .id(1L)
                .assetName("Server-01")
                .assetType("Server")
                .ipAddress("192.168.1.10")
                .cpuUsage(40.0)
                .memoryUsage(50.0)
                .diskUsage(60.0)
                .networkUsage(30.0)
                .status(Asset.AssetStatus.ONLINE)
                .build();

        when(assetRepository.findAll())
                .thenReturn(List.of(asset));

        List<AssetDTO> result = assetService.getAllAssets();

        assertEquals(1, result.size());
        assertEquals("Server-01", result.get(0).getAssetName());
        assertEquals("ONLINE", result.get(0).getStatus());

        verify(assetRepository).findAll();
    }


    @Test
    void getAssetById_ShouldReturnAsset_WhenAssetExists() {

        Asset asset = Asset.builder()
                .id(1L)
                .assetName("Server-01")
                .assetType("Server")
                .ipAddress("192.168.1.10")
                .cpuUsage(40.0)
                .memoryUsage(50.0)
                .diskUsage(60.0)
                .networkUsage(30.0)
                .status(Asset.AssetStatus.ONLINE)
                .build();

        when(assetRepository.findById(1L))
                .thenReturn(Optional.of(asset));

        AssetDTO result = assetService.getAssetById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Server-01", result.getAssetName());

        verify(assetRepository).findById(1L);
    }


    @Test
    void getAssetById_ShouldThrowException_WhenAssetDoesNotExist() {

        when(assetRepository.findById(99L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> assetService.getAssetById(99L)
        );

        assertEquals(
                "Asset not found: 99",
                exception.getMessage()
        );

        verify(assetRepository).findById(99L);
    }


    @Test
    void createAsset_ShouldSaveAndReturnAsset() {

        AssetDTO dto = AssetDTO.builder()
                .assetName("Server-02")
                .assetType("Server")
                .ipAddress("192.168.1.20")
                .cpuUsage(30.0)
                .memoryUsage(40.0)
                .diskUsage(50.0)
                .networkUsage(20.0)
                .status("ONLINE")
                .build();

        Asset savedAsset = Asset.builder()
                .id(2L)
                .assetName("Server-02")
                .assetType("Server")
                .ipAddress("192.168.1.20")
                .cpuUsage(30.0)
                .memoryUsage(40.0)
                .diskUsage(50.0)
                .networkUsage(20.0)
                .status(Asset.AssetStatus.ONLINE)
                .build();

        when(assetRepository.save(any(Asset.class)))
                .thenReturn(savedAsset);

        AssetDTO result = assetService.createAsset(dto);

        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("Server-02", result.getAssetName());
        assertEquals("ONLINE", result.getStatus());

        verify(assetRepository).save(any(Asset.class));
    }


    @Test
    void getDashboardSummary_ShouldCalculateCorrectValues() {

        Asset online = Asset.builder()
                .id(1L)
                .assetName("Server-01")
                .cpuUsage(40.0)
                .memoryUsage(50.0)
                .status(Asset.AssetStatus.ONLINE)
                .build();

        Asset offline = Asset.builder()
                .id(2L)
                .assetName("Server-02")
                .cpuUsage(60.0)
                .memoryUsage(70.0)
                .status(Asset.AssetStatus.OFFLINE)
                .build();

        when(assetRepository.findAll())
                .thenReturn(List.of(online, offline));

        DashboardSummaryDTO result =
                assetService.getDashboardSummary();

        assertEquals(2, result.getTotalAssets());
        assertEquals(1, result.getOnlineAssets());
        assertEquals(1, result.getOfflineAssets());

        assertEquals(50.0, result.getAvgCpuUsage());
        assertEquals(60.0, result.getAvgMemoryUsage());

        assertEquals(50.0, result.getUptimePercentage());

        verify(assetRepository).findAll();
    }
}