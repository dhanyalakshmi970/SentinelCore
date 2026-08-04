package com.sentinelcore.repository;

import com.sentinelcore.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset,Long> {
    List<Asset> findByStatus(String status);
    List<Asset> findByAssetType(String assetType);
}
