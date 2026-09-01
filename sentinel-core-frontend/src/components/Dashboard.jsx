import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Alert,
    CircularProgress,
    Button,
    TextField,
    InputAdornment
} from "@mui/material";

import {
    Computer,
    CheckCircle,
    Warning,
    ErrorOutlineOutlined,
    Memory,
    Storage,
    Refresh,
    Search
} from "@mui/icons-material";

import {
    getAllAssets,
    getDashboardSummary
} from "../api/assetApi";

import axiosClient from "../api/axiosClient";

import AssetControls from "./AssetControls";

import { useAuth } from "../context/AuthContext";


function Dashboard() {

    // ==========================================
    // Authentication
    // ==========================================

    const { logout } = useAuth();


    // ==========================================
    // State
    // ==========================================

    const [assets, setAssets] = useState([]);

    const [summary, setSummary] = useState(null);

    const [alerts, setAlerts] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ==========================================
    // Load Dashboard Data
    // ==========================================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            // --------------------------------------
            // Get all assets
            // --------------------------------------

            const assetResponse =
                await getAllAssets();


            console.log(
                "Assets:",
                assetResponse.data
            );


            setAssets(
                assetResponse.data || []
            );


            // --------------------------------------
            // Get dashboard summary
            // --------------------------------------

            const summaryResponse =
                await getDashboardSummary();


            console.log(
                "Dashboard Summary:",
                summaryResponse.data
            );


            setSummary(
                summaryResponse.data
            );


            // --------------------------------------
            // Get open alerts
            // --------------------------------------

            const alertResponse =
                await axiosClient.get(
                    "/api/alerts/open"
                );


            console.log(
                "Open Alerts:",
                alertResponse.data
            );


            setAlerts(
                alertResponse.data || []
            );


        } catch (err) {

            console.error(
                "Dashboard Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data"
            );


        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // Initial Load
    // ==========================================

    useEffect(() => {

        loadDashboard();


        // Refresh every 60 seconds

        const interval =
            setInterval(() => {

                loadDashboard();

            }, 60000);


        return () =>
            clearInterval(interval);

    }, []);


    // ==========================================
    // Search Assets
    // ==========================================

    const filteredAssets =
        assets.filter((asset) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            if (!search) {
                return true;
            }


            return (

                asset.name
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

                ||

                asset.assetName
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

                ||

                asset.type
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

                ||

                asset.assetType
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

                ||

                asset.ipAddress
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

                ||

                asset.ip
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

                ||

                asset.status
                    ?.toString()
                    .toLowerCase()
                    .includes(search)

            );

        });


    // ==========================================
    // Loading Screen
    // ==========================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh"
            >

                <CircularProgress />

            </Box>

        );

    }


    // ==========================================
    // Dashboard
    // ==========================================

    return (

        <Box
            sx={{
                padding: 4,
                backgroundColor: "#f5f7fa",
                minHeight: "100vh"
            }}
        >


            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >

                {/* Title */}

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        SentinelCore Dashboard
                    </Typography>


                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        Enterprise Security Operations Platform
                    </Typography>

                </Box>


                {/* Controls */}

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    {/* Admin-only Add Asset */}

                    <AssetControls />


                    {/* Refresh */}

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadDashboard}
                    >
                        Refresh
                    </Button>


                    {/* Logout */}

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={logout}
                    >
                        Logout
                    </Button>

                </Box>

            </Box>


            {/* ================================= */}
            {/* Error */}
            {/* ================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {/* ================================= */}
            {/* Search */}
            {/* ================================= */}

            <Box mb={4}>

                <TextField
                    fullWidth
                    placeholder="Search assets by name, type, IP address or status..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(
                            e.target.value
                        )
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        backgroundColor: "white"
                    }}
                />

            </Box>


            {/* ================================= */}
            {/* Summary Cards */}
            {/* ================================= */}

            <Grid
                container
                spacing={3}
                mb={4}
            >


                {/* Total Assets */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <Computer />


                                <Box>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Total Assets
                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >

                                        {
                                            summary?.totalAssets ??
                                            assets.length
                                        }

                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Online Assets */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <CheckCircle />


                                <Box>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Online Assets
                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >

                                        {
                                            summary?.onlineAssets ??
                                            assets.filter(
                                                asset =>
                                                    asset.status ===
                                                    "ONLINE"
                                            ).length
                                        }

                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Warnings */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <Warning />


                                <Box>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Warnings
                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >

                                        {
                                            summary?.warningAssets ??
                                            assets.filter(
                                                asset =>
                                                    asset.status ===
                                                    "WARNING"
                                            ).length
                                        }

                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Critical */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <ErrorOutlineOutlined />


                                <Box>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Critical
                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >

                                        {
                                            summary?.criticalAssets ??
                                            assets.filter(
                                                asset =>
                                                    asset.status ===
                                                    "CRITICAL"
                                            ).length
                                        }

                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* ================================= */}
            {/* System Health */}
            {/* ================================= */}

            <Typography
                variant="h5"
                fontWeight="bold"
                mb={2}
            >
                System Health
            </Typography>


            <Grid
                container
                spacing={3}
                mb={4}
            >


                {/* CPU */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                mb={2}
                            >

                                <Memory />


                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    CPU Usage
                                </Typography>

                            </Box>


                            <Typography
                                variant="h3"
                                fontWeight="bold"
                            >

                                {
                                    summary?.avgCpuUsage ??
                                    summary?.averageCpu ??
                                    summary?.cpuUsage ??
                                    0
                                }%

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Memory */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                mb={2}
                            >

                                <Memory />


                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    Memory Usage
                                </Typography>

                            </Box>


                            <Typography
                                variant="h3"
                                fontWeight="bold"
                            >

                                {
                                    summary?.avgMemoryUsage ??
                                    summary?.averageMemory ??
                                    summary?.memoryUsage ??
                                    0
                                }%

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Disk */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                mb={2}
                            >

                                <Storage />


                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    Disk Usage
                                </Typography>

                            </Box>


                            <Typography
                                variant="h3"
                                fontWeight="bold"
                            >

                                {
                                    summary?.avgDiskUsage ??
                                    summary?.averageDisk ??
                                    summary?.diskUsage ??
                                    0
                                }%

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* ================================= */}
            {/* Assets */}
            {/* ================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Assets
                </Typography>


                <Chip
                    label={`${filteredAssets.length} Assets`}
                />

            </Box>


            <Grid
                container
                spacing={3}
                mb={4}
            >

                {filteredAssets.length === 0 ? (

                    <Grid
                        item
                        xs={12}
                    >

                        <Card>

                            <CardContent>

                                <Typography
                                    color="text.secondary"
                                >
                                    No assets found.
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ) : (

                    filteredAssets.map(
                        (asset) => (

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={asset.id}
                            >

                                <Card>

                                    <CardContent>


                                        {/* Asset Name */}

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            mb={1}
                                        >
                                            {
                                                asset.name ||
                                                asset.assetName ||
                                                "Unnamed Asset"
                                            }
                                        </Typography>


                                        {/* Type */}

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Type:{" "}
                                            {
                                                asset.type ||
                                                asset.assetType ||
                                                "N/A"
                                            }
                                        </Typography>


                                        {/* IP */}

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            IP Address:{" "}
                                            {
                                                asset.ipAddress ||
                                                asset.ip ||
                                                "N/A"
                                            }
                                        </Typography>


                                        {/* Status */}

                                        <Box mt={1} mb={1}>

                                            <Chip
                                                size="small"
                                                label={
                                                    asset.status ||
                                                    "UNKNOWN"
                                                }
                                                color={
                                                    asset.status ===
                                                    "CRITICAL"
                                                        ? "error"
                                                        :
                                                        asset.status ===
                                                        "WARNING"
                                                            ? "warning"
                                                            :
                                                            "success"
                                                }
                                            />

                                        </Box>


                                        {/* CPU */}

                                        <Typography
                                            variant="body2"
                                        >
                                            CPU:{" "}
                                            {
                                                asset.cpuUsage ??
                                                asset.cpu ??
                                                0
                                            }%
                                        </Typography>


                                        {/* Memory */}

                                        <Typography
                                            variant="body2"
                                        >
                                            Memory:{" "}
                                            {
                                                asset.memoryUsage ??
                                                asset.memory ??
                                                0
                                            }%
                                        </Typography>


                                        {/* Disk */}

                                        <Typography
                                            variant="body2"
                                        >
                                            Disk:{" "}
                                            {
                                                asset.diskUsage ??
                                                asset.disk ??
                                                0
                                            }%
                                        </Typography>


                                    </CardContent>

                                </Card>

                            </Grid>

                        )
                    )

                )}

            </Grid>


            {/* ================================= */}
            {/* Open Alerts */}
            {/* ================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Open Alerts
                </Typography>


                <Chip
                    label={`${alerts.length} Open`}
                    icon={
                        <ErrorOutlineOutlined />
                    }
                />

            </Box>


            {/* ================================= */}
            {/* Alerts */}
            {/* ================================= */}

            {alerts.length === 0 ? (

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            No open alerts. All monitored
                            assets are operating normally.
                        </Typography>

                    </CardContent>

                </Card>

            ) : (

                <Grid
                    container
                    spacing={2}
                >

                    {alerts.map(
                        (alert) => (

                            <Grid
                                item
                                xs={12}
                                md={6}
                                key={alert.id}
                            >

                                <Card>

                                    <CardContent>

                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={1}
                                        >

                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                            >
                                                Alert #{alert.id}
                                            </Typography>


                                            <Chip
                                                label={
                                                    alert.severity
                                                }
                                                color={
                                                    alert.severity ===
                                                    "CRITICAL"
                                                        ? "error"
                                                        : "warning"
                                                }
                                            />

                                        </Box>


                                        <Typography
                                            variant="body1"
                                            mb={1}
                                        >
                                            {
                                                alert.message
                                            }
                                        </Typography>


                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Asset ID:{" "}
                                            {
                                                alert.assetId
                                            }
                                        </Typography>


                                        {alert.createdAt && (

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Created:{" "}
                                                {new Date(
                                                    alert.createdAt
                                                ).toLocaleString()}
                                            </Typography>

                                        )}

                                    </CardContent>

                                </Card>

                            </Grid>

                        )
                    )}

                </Grid>

            )}

        </Box>

    );

}


export default Dashboard;