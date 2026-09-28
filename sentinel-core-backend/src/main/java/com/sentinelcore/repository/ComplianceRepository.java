package com.sentinelcore.repository;

import com.sentinelcore.entity.ComplianceCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplianceRepository
        extends JpaRepository<ComplianceCheck, Long> {

    List<ComplianceCheck> findByFramework(String framework);

    List<ComplianceCheck> findByStatus(
            ComplianceCheck.ComplianceStatus status);
}