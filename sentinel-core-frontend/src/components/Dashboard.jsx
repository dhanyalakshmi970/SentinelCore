import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    Button
} from "@mui/material";

import {
    Computer,
    CheckCircle,
    Warning,
    ErrorOutlineOutlined,
    Memory,
    Storage,
    Refresh
} from "@mui/icons-material";

import {
    getAllAssets,
    getDashboardSummary
} from "../api/assetApi";

import AssetControls from "./AssetControls";


function Dashboard() {

    const [assets, setAssets] = useState([]);
    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Load Dashboard Data
    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            // Get all assets
            const assetResponse = await getAllAssets();
            setAssets(assetResponse.data);

            // Get dashboard summary
            const summaryResponse = await getDashboardSummary();
            setSummary(summaryResponse.data);

        } catch (err) {

            console.error("Dashboard Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard data"
            );

        } finally {

            setLoading(false);

        }
    };


    // Initial Load
    useEffect(() => {

        loadDashboard();

        const interval = setInterval(() => {
            loadDashboard();
        }, 60000);

        return () => clearInterval(interval);

    }, []);


    // Loading Screen
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


    return (

        <Box
            sx={{
                padding: 4,
                backgroundColor: "#f5f7fa",
                minHeight: "100vh"
            }}
        >

            {/* Header */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
            >

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


                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <AssetControls />

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadDashboard}
                    >
                        Refresh
                    </Button>

                </Box>

            </Box>


            {/* Error */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {/* Summary Cards */}

            <Grid
                container
                spacing={3}
                mb={4}
            >

                {/* Total Assets */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <Computer />

                                <Box>

                                    <Typography color="text.secondary">
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

                <Grid item xs={12} sm={6} md={3}>

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <CheckCircle />

                                <Box>

                                    <Typography color="text.secondary">
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
                                                    asset.status === "ONLINE"
                                            ).length
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Warnings */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <Warning />

                                <Box>

                                    <Typography color="text.secondary">
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
                                                    asset.status === "WARNING"
                                            ).length
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Critical */}

                <Grid item xs={12} sm={6} md={3}>

                    <Card>

                        <CardContent>

                            <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                            >

                                <ErrorOutlineOutlined />

                                <Box>

                                    <Typography color="text.secondary">
                                        Critical
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                    >
                                        {
                                            summary?.criticalAlerts ??
                                            assets.filter(
                                                asset =>
                                                    asset.status === "CRITICAL"
                                            ).length
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* System Health */}

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

                <Grid item xs={12} md={4}>

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
                                    summary?.avgCpuUsage != null
                                        ? summary.avgCpuUsage.toFixed(1)
                                        : "0.0"
                                }%
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Memory */}

                <Grid item xs={12} md={4}>

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
                                    summary?.avgMemoryUsage != null
                                        ? summary.avgMemoryUsage.toFixed(1)
                                        : "0.0"
                                }%
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Disk */}

                <Grid item xs={12} md={4}>

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
                                    summary?.avgDiskUsage != null
                                        ? summary.avgDiskUsage.toFixed(1)
                                        : "0.0"
                                }%
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>

    );

}


export default Dashboard;