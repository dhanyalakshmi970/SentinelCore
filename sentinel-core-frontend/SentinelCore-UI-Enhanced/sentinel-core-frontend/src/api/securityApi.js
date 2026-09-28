import axiosClient from "./axiosClient";

// ============================================================
// ALERTS
// ============================================================

// Get only OPEN alerts
export const getAlerts = () =>
    axiosClient.get("/api/alerts/open");

// Get ALL alerts including RESOLVED alerts
export const getAllAlerts = () =>
    axiosClient.get("/api/alerts");

// Create alert
export const createAlert = (
    assetId,
    severity,
    message
) =>
    axiosClient.post(
        "/api/alerts",
        null,
        {
            params: {
                assetId,
                severity,
                message
            }
        }
    );

// Resolve alert
export const resolveAlert = (id) =>
    axiosClient.put(
        `/api/alerts/${id}/resolve`
    );


// ============================================================
// INCIDENTS
// ============================================================

export const getIncidents = () =>
    axiosClient.get("/api/incidents");

export const createIncident = (data) =>
    axiosClient.post(
        "/api/incidents",
        data
    );

export const assignIncident = (
    id,
    user
) =>
    axiosClient.put(
        `/api/incidents/${id}/assign`,
        null,
        {
            params: {
                user
            }
        }
    );

export const updateIncidentStatus = (
    id,
    status
) =>
    axiosClient.put(
        `/api/incidents/${id}/status`,
        null,
        {
            params: {
                status
            }
        }
    );

export const deleteIncident = (id) =>
    axiosClient.delete(
        `/api/incidents/${id}`
    );


// ============================================================
// VULNERABILITIES
// ============================================================

export const getVulnerabilities = () =>
    axiosClient.get(
        "/api/vulnerabilities"
    );

export const createVulnerability = (
    data
) =>
    axiosClient.post(
        "/api/vulnerabilities",
        data
    );

export const patchVulnerability = (
    id
) =>
    axiosClient.put(
        `/api/vulnerabilities/${id}/patch`
    );


// ============================================================
// COMPLIANCE
// ============================================================

export const getCompliance = () =>
    axiosClient.get(
        "/api/compliance"
    );

export const createCompliance = (
    data
) =>
    axiosClient.post(
        "/api/compliance",
        data
    );


// ============================================================
// AUDIT
// ============================================================

export const getAuditLogs = () =>
    axiosClient.get(
        "/api/audit"
    );