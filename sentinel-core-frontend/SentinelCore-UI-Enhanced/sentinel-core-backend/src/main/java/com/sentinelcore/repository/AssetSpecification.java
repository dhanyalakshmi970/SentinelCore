package com.sentinelcore.repository;

import com.sentinelcore.entity.Asset;
import org.springframework.data.jpa.domain.Specification;

public class AssetSpecification {

    public static Specification<Asset> searchAssets(
            String search,
            String status,
            String risk
    ) {

        Specification<Asset> specification = null;

        // Search by asset name
        if (search != null && !search.isBlank()) {

            Specification<Asset> searchSpec =
                    (root, query, cb) ->
                            cb.like(
                                    cb.lower(root.get("assetName")),
                                    "%" + search.toLowerCase() + "%"
                            );

            specification = searchSpec;
        }

        // Filter by status
        if (status != null && !status.isBlank()) {

            Specification<Asset> statusSpec =
                    (root, query, cb) ->
                            cb.equal(
                                    root.get("status"),
                                    status
                            );

            specification = specification == null
                    ? statusSpec
                    : specification.and(statusSpec);
        }

        // Filter by risk
        if (risk != null && !risk.isBlank()) {

            Specification<Asset> riskSpec =
                    (root, query, cb) ->
                            cb.equal(
                                    root.get("risk"),
                                    risk
                            );

            specification = specification == null
                    ? riskSpec
                    : specification.and(riskSpec);
        }

        // If no filters are provided, return everything
        return specification == null
                ? (root, query, cb) -> cb.conjunction()
                : specification;
    }
}