import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    LinearProgress,
    Stack,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Divider,
} from "@mui/material";

import {
    Computer,
    Memory,
    Storage,
    Warning,
    Error as ErrorIcon,
    CheckCircle,
    Refresh,
    Search,
    AccessTime,
} from "@mui/icons-material";

import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const getHealthStatus = (value) => {
    const number = Number(value) || 0;

    if (number >= 80) {
        return {
            label: "Critical",
            color: "error",
        };
    }

    if (number >= 60) {
        return {
            label: "Warning",
            color: "warning",
        };
    }

    return {
        label: "Healthy",
        color: "success",
    };
};


const getStatusColor = (status) => {
    switch (String(status).toUpperCase()) {
        case "ONLINE":
        case "HEALTHY":
            return "success";

        case "WARNING":
            return "warning";

        case "CRITICAL":
        case "OFFLINE":
            return "error";

        default:
            return "default";
    }
};


const getMetricValue = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return 0;
    }

    return Math.round(number);
};


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
    iconBackground,
    iconColor,
    onClick,
}) {
    return (
        <Card
            onClick={onClick}
            sx={{
                height: "100%",
                cursor: onClick ? "pointer" : "default",
                border: "1px solid #e4e7ec",
                borderRadius: 3,
                transition: "all 0.2s ease",

                "&:hover": onClick
                    ? {
                          transform: "translateY(-3px)",
                          boxShadow:
                              "0 10px 30px rgba(16,24,40,0.10)",
                      }
                    : {},
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#667085",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                mt: 1,
                                fontWeight: 700,
                                color: "#172033",
                            }}
                        >
                            {value}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.5,
                                color: "#667085",
                            }}
                        >
                            {subtitle}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: iconBackground,
                            color: iconColor,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}


/* =========================================================
   HEALTH CARD
========================================================= */

function HealthCard({
    title,
    value,
    icon,
}) {
    const metric = getMetricValue(value);
    const health = getHealthStatus(metric);

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f2f4f7",
                                color: "#475467",
                            }}
                        >
                            {icon}
                        </Box>

                        <Typography
                            fontWeight={600}
                        >
                            {title}
                        </Typography>
                    </Stack>

                    <Chip
                        label={health.label}
                        color={health.color}
                        size="small"
                    />
                </Stack>

                <Typography
                    variant="h4"
                    sx={{
                        mt: 2,
                        fontWeight: 700,
                    }}
                >
                    {metric}%
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={Math.min(metric, 100)}
                    color={health.color}
                    sx={{
                        mt: 1.5,
                        height: 8,
                        borderRadius: 10,
                        backgroundColor: "#eaecf0",
                    }}
                />

                <Typography
                    variant="body2"
                    sx={{
                        mt: 1,
                        color: "#667085",
                    }}
                >
                    Current utilization
                </Typography>
            </CardContent>
        </Card>
    );
}


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
    const { logout } = useAuth();

    const [summary, setSummary] = useState({});
    const [assets, setAssets] = useState([]);
    const [alerts, setAlerts] = useState([]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState(null);


    /* =====================================================
       LOAD DASHBOARD
    ===================================================== */

    const loadDashboard = async (
        showLoader = true
    ) => {
        try {
            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const [
                summaryResponse,
                assetsResponse,
                alertsResponse,
            ] = await Promise.all([
                axiosClient.get(
                    "/api/assets/dashboard/summary"
                ),

                axiosClient.get(
                    "/api/assets/getAll"
                ),

                axiosClient.get(
                    "/api/alerts/open"
                ),
            ]);

            setSummary(
                summaryResponse.data || {}
            );

            setAssets(
                Array.isArray(assetsResponse.data)
                    ? assetsResponse.data
                    : []
            );

            setAlerts(
                Array.isArray(alertsResponse.data)
                    ? alertsResponse.data
                    : []
            );

            setLastUpdated(new Date());

        } catch (err) {
            console.error(
                "Dashboard loading error:",
                err
            );

            setError(
                "Unable to load the latest infrastructure data."
            );

        } finally {
            if (showLoader) {
                setLoading(false);
            }

            setRefreshing(false);
        }
    };


    /* =====================================================
       INITIAL LOAD + AUTO REFRESH
    ===================================================== */

    useEffect(() => {
        loadDashboard(true);

        const interval = setInterval(() => {
            loadDashboard(false);
        }, 60000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    const filteredAssets = assets.filter(
        (asset) => {
            const searchText =
                search.toLowerCase().trim();

            const assetName =
                String(
                    asset.name ||
                        asset.assetName ||
                        ""
                ).toLowerCase();

            const hostname =
                String(
                    asset.hostname || ""
                ).toLowerCase();

            const ipAddress =
                String(
                    asset.ipAddress ||
                        asset.ip ||
                        ""
                ).toLowerCase();

            const matchesSearch =
                !searchText ||
                assetName.includes(searchText) ||
                hostname.includes(searchText) ||
                ipAddress.includes(searchText);

            const assetStatus =
                String(
                    asset.status || ""
                ).toUpperCase();

            const matchesStatus =
                statusFilter === "ALL" ||
                assetStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        }
    );


    /* =====================================================
       SUMMARY VALUES
    ===================================================== */

    const totalAssets =
        summary.totalAssets ??
        summary.total ??
        assets.length;

    const onlineAssets =
        summary.onlineAssets ??
        summary.online ??
        assets.filter(
            (asset) =>
                String(
                    asset.status
                ).toUpperCase() === "ONLINE"
        ).length;

    const warnings =
        summary.warnings ??
        summary.warningCount ??
        alerts.filter(
            (alert) =>
                String(
                    alert.severity
                ).toUpperCase() === "WARNING"
        ).length;

    const critical =
        summary.critical ??
        summary.criticalCount ??
        alerts.filter(
            (alert) =>
                String(
                    alert.severity
                ).toUpperCase() === "CRITICAL"
        ).length;


    const cpu =
        summary.averageCpu ??
        summary.cpuUsage ??
        summary.cpu ??
        0;

    const memory =
        summary.averageMemory ??
        summary.memoryUsage ??
        summary.memory ??
        0;

    const disk =
        summary.averageDisk ??
        summary.diskUsage ??
        summary.disk ??
        0;


    /* =====================================================
       LOADING SCREEN
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f7fb",
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress />

                    <Typography
                        color="text.secondary"
                    >
                        Loading infrastructure data...
                    </Typography>
                </Stack>
            </Box>
        );
    }


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f7fb",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                },
            }}
        >
            {/* ============================================
                HEADER
            ============================================ */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#172033",
                            fontSize: {
                                xs: "1.7rem",
                                md: "2.2rem",
                            },
                        }}
                    >
                        Infrastructure Overview
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mt: 0.5,
                            color: "#667085",
                        }}
                    >
                        Monitor and manage your
                        enterprise infrastructure
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1.5 }}
                    >
                        <Box
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor:
                                    "#16a34a",
                            }}
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            All systems operational
                        </Typography>

                        {lastUpdated && (
                            <>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    •
                                </Typography>

                                <AccessTime
                                    sx={{
                                        fontSize: 16,
                                        color: "#98a2b3",
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Updated{" "}
                                    {lastUpdated.toLocaleTimeString()}
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            refreshing ? (
                                <CircularProgress
                                    size={16}
                                />
                            ) : (
                                <Refresh />
                            )
                        }
                        onClick={() =>
                            loadDashboard(true)
                        }
                        disabled={refreshing}
                        sx={{
                            borderColor:
                                "#d0d5dd",
                            color: "#344054",
                            backgroundColor:
                                "#fff",

                            "&:hover": {
                                backgroundColor:
                                    "#f9fafb",
                                borderColor:
                                    "#98a2b3",
                            },
                        }}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={logout}
                        sx={{
                            borderColor:
                                "#f04438",
                            color: "#d92d20",

                            "&:hover": {
                                backgroundColor:
                                    "#fef3f2",
                                borderColor:
                                    "#d92d20",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>


            {/* ============================================
                ERROR
            ============================================ */}

            {error && (
                <Card
                    sx={{
                        mb: 3,
                        border:
                            "1px solid #fecdca",
                        backgroundColor:
                            "#fffbfa",
                    }}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            <ErrorIcon
                                color="error"
                            />

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    fontWeight={600}
                                >
                                    Unable to update
                                    dashboard
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {error}
                                </Typography>
                            </Box>

                            <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                    loadDashboard(true)
                                }
                            >
                                Retry
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            )}


            {/* ============================================
                SUMMARY CARDS
            ============================================ */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                    }}
                >
                    <SummaryCard
                        title="Total Assets"
                        value={totalAssets}
                        subtitle="Assets under monitoring"
                        icon={<Computer />}
                        iconBackground="#eff6ff"
                        iconColor="#2563eb"
                        onClick={() => {
                            setStatusFilter(
                                "ALL"
                            );
                            window.scrollTo({
                                top: document.body
                                    .scrollHeight,
                                behavior: "smooth",
                            });
                        }}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                    }}
                >
                    <SummaryCard
                        title="Online"
                        value={onlineAssets}
                        subtitle="Currently operational"
                        icon={
                            <CheckCircle />
                        }
                        iconBackground="#f0fdf4"
                        iconColor="#16a34a"
                        onClick={() =>
                            setStatusFilter(
                                "ONLINE"
                            )
                        }
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                    }}
                >
                    <SummaryCard
                        title="Warnings"
                        value={warnings}
                        subtitle="Needs attention"
                        icon={<Warning />}
                        iconBackground="#fffbeb"
                        iconColor="#f59e0b"
                        onClick={() =>
                            setStatusFilter(
                                "WARNING"
                            )
                        }
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                    }}
                >
                    <SummaryCard
                        title="Critical"
                        value={critical}
                        subtitle="Action required"
                        icon={<ErrorIcon />}
                        iconBackground="#fef2f2"
                        iconColor="#dc2626"
                        onClick={() =>
                            setStatusFilter(
                                "CRITICAL"
                            )
                        }
                    />
                </Grid>
            </Grid>


            {/* ============================================
                SYSTEM HEALTH
            ============================================ */}

            <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                    >
                        System Health
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Current infrastructure
                        resource utilization
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <HealthCard
                            title="CPU Usage"
                            value={cpu}
                            icon={<Computer />}
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <HealthCard
                            title="Memory Usage"
                            value={memory}
                            icon={<Memory />}
                        />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 4,
                        }}
                    >
                        <HealthCard
                            title="Disk Usage"
                            value={disk}
                            icon={<Storage />}
                        />
                    </Grid>
                </Grid>
            </Box>


            {/* ============================================
                OPEN ALERTS
            ============================================ */}

            <Box sx={{ mb: 4 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700 }}
                        >
                            Open Alerts
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Issues requiring attention
                        </Typography>
                    </Box>

                    <Chip
                        label={`${alerts.length} active`}
                        color={
                            alerts.length > 0
                                ? "warning"
                                : "success"
                        }
                    />
                </Stack>

                {alerts.length === 0 ? (
                    <Card
                        sx={{
                            borderRadius: 3,
                            textAlign: "center",
                            py: 5,
                        }}
                    >
                        <CheckCircle
                            sx={{
                                fontSize: 52,
                                color: "success.main",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            All Systems Clear
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No active infrastructure
                            alerts detected.
                        </Typography>
                    </Card>
                ) : (
                    <Stack spacing={1.5}>
                        {alerts
                            .slice(0, 5)
                            .map((alert, index) => {
                                const severity =
                                    String(
                                        alert.severity ||
                                            "WARNING"
                                    ).toUpperCase();

                                const isCritical =
                                    severity ===
                                    "CRITICAL";

                                return (
                                    <Card
                                        key={
                                            alert.id ||
                                            index
                                        }
                                        sx={{
                                            borderLeft:
                                                isCritical
                                                    ? "4px solid #dc2626"
                                                    : "4px solid #f59e0b",
                                            borderRadius: 2,
                                            transition:
                                                "all 0.2s ease",

                                            "&:hover": {
                                                boxShadow:
                                                    "0 8px 24px rgba(16,24,40,0.10)",
                                            },
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                py: 2,
                                                "&:last-child":
                                                    {
                                                        pb: 2,
                                                    },
                                            }}
                                        >
                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    sm: "row",
                                                }}
                                                justifyContent="space-between"
                                                spacing={2}
                                            >
                                                <Box>
                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                    >
                                                        <Typography
                                                            fontWeight={
                                                                700
                                                            }
                                                        >
                                                            {alert.assetName ||
                                                                alert.asset?.name ||
                                                                `Alert #${
    alert.id ||
    index +
    1
}`}
                                                        </Typography>

                                                        <Chip
                                                            size="small"
                                                            label={
                                                                severity
                                                            }
                                                            color={
                                                                getStatusColor(
                                                                    severity
                                                                )
                                                            }
                                                        />
                                                    </Stack>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 0.5,
                                                        }}
                                                    >
                                                        {alert.message ||
                                                            alert.description ||
                                                            "Infrastructure issue detected"}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {alert.createdAt
                                                        ? new Date(
                                                              alert.createdAt
                                                          ).toLocaleString()
                                                        : "Recently"}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                    </Stack>
                )}
            </Box>


            {/* ============================================
                ASSETS
            ============================================ */}

            <Box>
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700 }}
                    >
                        Assets
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Search and monitor your
                        infrastructure assets
                    </Typography>
                </Box>


                {/* SEARCH + FILTERS */}

                <Card
                    sx={{
                        mb: 2,
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Stack
                            direction={{
                                xs: "column",
                                md: "row",
                            }}
                            spacing={2}
                        >
                            <TextField
                                fullWidth
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by asset name, hostname or IP address..."
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search
                                                sx={{
                                                    color:
                                                        "#98a2b3",
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                            >
                                {[
                                    "ALL",
                                    "ONLINE",
                                    "WARNING",
                                    "CRITICAL",
                                ].map(
                                    (status) => (
                                        <Button
                                            key={
                                                status
                                            }
                                            size="small"
                                            variant={
                                                statusFilter ===
                                                status
                                                    ? "contained"
                                                    : "outlined"
                                            }
                                            onClick={() =>
                                                setStatusFilter(
                                                    status
                                                )
                                            }
                                        >
                                            {status ===
                                            "ALL"
                                                ? "All"
                                                : status
                                                      .charAt(
                                                          0
                                                      )
                                                      .toUpperCase() +
                                                  status
                                                      .slice(
                                                          1
                                                      )
                                                      .toLowerCase()}
                                        </Button>
                                    )
                                )}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>


                {/* ASSET LIST */}

                <Card
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    {filteredAssets.length ===
                    0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 6,
                                px: 2,
                            }}
                        >
                            <Search
                                sx={{
                                    fontSize: 46,
                                    color: "#98a2b3",
                                    mb: 1,
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                No assets found
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Try changing your
                                search or filter.
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            {filteredAssets.map(
                                (
                                    asset,
                                    index
                                ) => {
                                    const status =
                                        String(
                                            asset.status ||
                                                "UNKNOWN"
                                        ).toUpperCase();

                                    const assetName =
                                        asset.name ||
                                        asset.assetName ||
                                        `Asset ${
    index + 1
}`;

                                    const hostname =
                                        asset.hostname ||
                                        "-";

                                    const ip =
                                        asset.ipAddress ||
                                        asset.ip ||
                                        "-";

                                    const assetCpu =
                                        getMetricValue(
                                            asset.cpuUsage ??
                                                asset.cpu
                                        );

                                    const assetMemory =
                                        getMetricValue(
                                            asset.memoryUsage ??
                                                asset.memory
                                        );

                                    const assetDisk =
                                        getMetricValue(
                                            asset.diskUsage ??
                                                asset.disk
                                        );

                                    return (
                                        <Box
                                            key={
                                                asset.id ||
                                                asset.assetId ||
                                                index
                                            }
                                        >
                                            <Box
                                                sx={{
                                                    p: {
                                                        xs: 2,
                                                        md: 2.5,
                                                    },

                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#f9fafb",
                                                    },
                                                }}
                                            >
                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        md: "row",
                                                    }}
                                                    spacing={2}
                                                    alignItems={{
                                                        md: "center",
                                                    }}
                                                >
                                                    {/* NAME */}

                                                    <Box
                                                        sx={{
                                                            flex: 1.5,
                                                        }}
                                                    >
                                                        <Stack
                                                            direction="row"
                                                            spacing={
                                                                1.5
                                                            }
                                                            alignItems="center"
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: 2,
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    backgroundColor:
                                                                        "#f2f4f7",
                                                                    color:
                                                                        "#475467",
                                                                }}
                                                            >
                                                                <Computer
                                                                    fontSize="small"
                                                                />
                                                            </Box>

                                                            <Box>
                                                                <Typography
                                                                    fontWeight={
                                                                        700
                                                                    }
                                                                >
                                                                    {
                                                                        assetName
                                                                    }
                                                                </Typography>

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        hostname
                                                                    }
                                                                    {" • "}
                                                                    {
                                                                        ip
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>


                                                    {/* STATUS */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 110,
                                                        }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={
                                                                status
                                                            }
                                                            color={getStatusColor(
                                                                status
                                                            )}
                                                        />
                                                    </Box>


                                                    {/* CPU */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 110,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            CPU
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={
                                                                600
                                                            }
                                                        >
                                                            {
                                                                assetCpu
                                                            }
                                                            %
                                                        </Typography>
                                                    </Box>


                                                    {/* MEMORY */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 110,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Memory
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={
                                                                600
                                                            }
                                                        >
                                                            {
                                                                assetMemory
                                                            }
                                                            %
                                                        </Typography>
                                                    </Box>


                                                    {/* DISK */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 110,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Disk
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={
                                                                600
                                                            }
                                                        >
                                                            {
                                                                assetDisk
                                                            }
                                                            %
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>

                                            {index <
                                                filteredAssets.length -
                                                    1 && (
                                                <Divider />
                                            )}
                                        </Box>
                                    );
                                }
                            )}
                        </Box>
                    )}
                </Card>
            </Box>
        </Box>
    );
}

export default Dashboard;