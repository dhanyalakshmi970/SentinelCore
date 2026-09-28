import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Grid,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";

import {
    Computer,
    Memory,
    Storage,
    Error as ErrorIcon,
    CheckCircle,
    Refresh,
    AccessTime,
} from "@mui/icons-material";

import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

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


const getMetricValue = (value) => {
    const number = Number(value);

    if (Number.isNaN(number)) {
        return 0;
    }

    return Math.round(number);
};


// ============================================================
// SUMMARY CARD
// ============================================================

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


// ============================================================
// HEALTH CARD
// ============================================================

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

                        <Typography fontWeight={600}>
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


// ============================================================
// DASHBOARD
// ============================================================

function Dashboard() {

    const navigate = useNavigate();

    const { logout, isAdmin } = useAuth();

    const [summary, setSummary] = useState({});

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState(null);


    // ========================================================
    // LOAD DASHBOARD SUMMARY
    // ========================================================

    const loadDashboard = async (showLoader = true) => {

        try {

            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");


            const response = await axiosClient.get(
                "/api/assets/dashboard/summary"
            );


            setSummary(
                response.data || {}
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


    // ========================================================
    // INITIAL LOAD + AUTO REFRESH
    // ========================================================

    useEffect(() => {

        loadDashboard(true);

        const interval = setInterval(() => {
            loadDashboard(false);
        }, 60000);

        return () => {
            clearInterval(interval);
        };

    }, []);


    // ========================================================
    // SUMMARY VALUES
    // ========================================================

    const totalAssets =
        summary.totalAssets ??
        summary.total ??
        0;


    const onlineAssets =
        summary.onlineAssets ??
        summary.online ??
        0;


    const offlineAssets =
        summary.offlineAssets ??
        summary.offline ??
        0;


    const criticalAlerts =
        summary.criticalAlerts ??
        summary.critical ??
        summary.criticalCount ??
        0;


    const uptime =
        Number(
            summary.uptimePercentage ??
            summary.uptime ??
            0
        );


    const cpu =
        Number(
            summary.avgCpuUsage ?? 0
        );


    const memory =
        Number(
            summary.avgMemoryUsage ?? 0
        );


    const disk =
        Number(
            summary.avgDiskUsage ?? 0
        );


    // ========================================================
    // LOADING
    // ========================================================

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

                    <Typography color="text.secondary">
                        Loading infrastructure data...
                    </Typography>

                </Stack>

            </Box>
        );
    }


    // ========================================================
    // MAIN UI
    // ========================================================

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

            <Container maxWidth="xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

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
                            Monitor your enterprise
                            infrastructure
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
                                    backgroundColor: "#16a34a",
                                }}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Infrastructure monitoring active
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


                    {/* HEADER BUTTONS */}

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                    >

                        {isAdmin && (
                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate("/add-asset")
                                }
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                + Add Asset
                            </Button>
                        )}


                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/assets")
                            }
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Assets
                        </Button>


                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate("/alerts")
                            }
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Open Alerts
                        </Button>


                        <Button
                            variant="outlined"
                            startIcon={
                                refreshing
                                    ? <CircularProgress size={16} />
                                    : <Refresh />
                            }
                            onClick={() =>
                                loadDashboard(true)
                            }
                            disabled={refreshing}
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Refresh
                        </Button>


                        <Button
                            variant="outlined"
                            onClick={logout}
                            sx={{
                                textTransform: "none",
                                borderColor: "#f04438",
                                color: "#d92d20",
                            }}
                        >
                            Logout
                        </Button>

                    </Stack>

                </Box>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <Card
                        sx={{
                            mb: 3,
                            border: "1px solid #fecdca",
                            backgroundColor: "#fffbfa",
                        }}
                    >

                        <CardContent>

                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >

                                <ErrorIcon color="error" />

                                <Box sx={{ flex: 1 }}>

                                    <Typography
                                        fontWeight={600}
                                    >
                                        Unable to update dashboard
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
                                    sx={{
                                        textTransform: "none",
                                    }}
                                >
                                    Retry
                                </Button>

                            </Stack>

                        </CardContent>

                    </Card>
                )}


                {/* ==================================================
                    SUMMARY CARDS
                ================================================== */}

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
                            onClick={() =>
                                navigate("/assets")
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
                            title="Online"
                            value={onlineAssets}
                            subtitle="Currently operational"
                            icon={<CheckCircle />}
                            iconBackground="#f0fdf4"
                            iconColor="#16a34a"
                            onClick={() =>
                                navigate("/assets")
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
                            title="Uptime"
                            value={`${Math.round(uptime)}%`}
                            subtitle="Infrastructure availability"
                            icon={<CheckCircle />}
                            iconBackground="#f0fdf4"
                            iconColor="#16a34a"
                            onClick={() =>
                                navigate("/assets")
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
                            title="Critical Alerts"
                            value={criticalAlerts}
                            subtitle="Action required"
                            icon={<ErrorIcon />}
                            iconBackground="#fef2f2"
                            iconColor="#dc2626"
                            onClick={() =>
                                navigate("/alerts")
                            }
                        />

                    </Grid>

                </Grid>


                {/* ==================================================
                    SYSTEM HEALTH
                ================================================== */}

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


                {/* ==================================================
                    QUICK NAVIGATION
                ================================================== */}

                <Card
                    sx={{
                        borderRadius: 3,
                        mb: 3,
                    }}
                >

                    <CardContent sx={{ p: 3 }}>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Quick Navigation
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5, mb: 2 }}
                        >
                            Access detailed monitoring pages
                        </Typography>


                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                        >

                            <Button
                                variant="outlined"
                                startIcon={<Computer />}
                                onClick={() =>
                                    navigate("/assets")
                                }
                                sx={{
                                    textTransform: "none",
                                    py: 1.2,
                                }}
                            >
                                View All Assets
                            </Button>


                            <Button
                                variant="outlined"
                                startIcon={<ErrorIcon />}
                                onClick={() =>
                                    navigate("/alerts")
                                }
                                sx={{
                                    textTransform: "none",
                                    py: 1.2,
                                }}
                            >
                                View Open Alerts
                            </Button>


                            {isAdmin && (
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        navigate("/add-asset")
                                    }
                                    sx={{
                                        textTransform: "none",
                                        py: 1.2,
                                    }}
                                >
                                    Add New Asset
                                </Button>
                            )}

                        </Stack>

                    </CardContent>

                </Card>


                {/* ==================================================
                    OFFLINE INFORMATION
                ================================================== */}

                <Card
                    sx={{
                        borderRadius: 3,
                    }}
                >

                    <CardContent sx={{ p: 3 }}>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >

                            <Box>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Offline Assets
                                </Typography>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                >
                                    {offlineAssets}
                                </Typography>

                            </Box>


                            <Button
                                variant="text"
                                onClick={() =>
                                    navigate("/assets")
                                }
                                sx={{
                                    textTransform: "none",
                                }}
                            >
                                View Assets →
                            </Button>

                        </Stack>

                    </CardContent>

                </Card>

            </Container>

        </Box>
    );
}


export default Dashboard;