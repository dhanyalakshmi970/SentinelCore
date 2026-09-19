package com.sentinelcore.repository;

import com.sentinelcore.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert,Long> {
    List<Alert> findByStatus(Alert.AlertStatus status);
}
