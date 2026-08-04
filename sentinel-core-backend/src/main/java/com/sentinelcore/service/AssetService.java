package com.sentinelcore.service;

import com.sentinelcore.dto.AssetDTO;
import com.sentinelcore.entity.Asset;

import java.util.List;

public interface AssetService {
    List<AssetDTO> getAllAssets();
    AssetDTO getById(Long id);
    Asset createAsset(Asset asset);
}
