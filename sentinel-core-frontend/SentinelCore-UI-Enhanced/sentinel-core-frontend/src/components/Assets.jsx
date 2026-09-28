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
    Divider,
    Grid,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Computer,
    Refresh,
    Search,
} from "@mui/icons-material";

import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

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


// ============================================================
// ASSETS
// ============================================================

function Assets() {

    const navigate = useNavigate();

    const { logout, isAdmin } = useAuth();


    const [assets, setAssets] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD ASSETS
    // ========================================================

    const loadAssets = async () => {

        try {

            setRefreshing(true);
            setError("");


            const response =
                await axiosClient.get(
                    "/api/assets/getAll"
                );


            setAssets(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Assets loading error:",
                err
            );

            setError(
                "Unable to load assets. Please try again."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadAssets();

    }, []);


    // ========================================================
    // SEARCH + FILTER
    // ========================================================

    const filteredAssets =
        assets.filter((asset) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            const assetName =
                String(
                    asset.assetName ||
                    asset.name ||
                    ""
                ).toLowerCase();


            const assetType =
                String(
                    asset.assetType ||
                    ""
                ).toLowerCase();


            const hostname =
                String(
                    asset.hostname ||
                    ""
                ).toLowerCase();


            const ipAddress =
                String(
                    asset.ipAddress ||
                    asset.ip ||
                    ""
                ).toLowerCase();


            const status =
                String(
                    asset.status ||
                    ""
                ).toUpperCase();


            const matchesSearch =
                !searchText ||
                assetName.includes(searchText) ||
                assetType.includes(searchText) ||
                hostname.includes(searchText) ||
                ipAddress.includes(searchText);


            const matchesStatus =
                statusFilter === "ALL" ||
                status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );
        });


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
                        Loading assets...
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
                py: 4,
            }}
        >

            <Container maxWidth="xl">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    justifyContent="space-between"
                    alignItems={{
                        xs: "flex-start",
                        md: "center",
                    }}
                    spacing={2}
                    sx={{ mb: 4 }}
                >

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Assets
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Search and monitor your
                            enterprise infrastructure
                        </Typography>

                    </Box>


                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Dashboard
                        </Button>


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
                            onClick={loadAssets}
                            disabled={refreshing}
                            startIcon={
                                refreshing
                                    ? <CircularProgress size={16} />
                                    : <Refresh />
                            }
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

                </Stack>


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

                            <Typography
                                color="error"
                                fontWeight={600}
                            >
                                {error}
                            </Typography>

                            <Button
                                onClick={loadAssets}
                                sx={{
                                    mt: 1,
                                    textTransform: "none",
                                }}
                            >
                                Retry
                            </Button>

                        </CardContent>

                    </Card>
                )}


                {/* ==================================================
                    SEARCH + FILTER
                ================================================== */}

                <Card
                    sx={{
                        mb: 3,
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
                                size="small"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by asset name, type, hostname or IP address..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search
                                                sx={{
                                                    color: "#98a2b3",
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
                                useFlexGap
                            >

                                {[
                                    "ALL",
                                    "ONLINE",
                                    "WARNING",
                                    "CRITICAL",
                                    "OFFLINE",
                                ].map((status) => (

                                    <Button
                                        key={status}
                                        size="small"
                                        variant={
                                            statusFilter === status
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() =>
                                            setStatusFilter(
                                                status
                                            )
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                        }}
                                    >
                                        {status === "ALL"
                                            ? "All"
                                            : status
                                                .charAt(0)
                                                .toUpperCase() +
                                            status
                                                .slice(1)
                                                .toLowerCase()}
                                    </Button>

                                ))}

                            </Stack>

                        </Stack>

                    </CardContent>

                </Card>


                {/* ==================================================
                    RESULT COUNT
                ================================================== */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Showing{" "}
                        <strong>
                            {filteredAssets.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {assets.length}
                        </strong>{" "}
                        assets
                    </Typography>

                </Stack>


                {/* ==================================================
                    ASSET LIST
                ================================================== */}

                <Card
                    sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >

                    {filteredAssets.length === 0 ? (

                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                                px: 2,
                            }}
                        >

                            <Search
                                sx={{
                                    fontSize: 50,
                                    color: "#98a2b3",
                                }}
                            />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ mt: 1 }}
                            >
                                No assets found
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Try changing your search
                                or filter.
                            </Typography>

                        </Box>

                    ) : (

                        <Box>

                            {filteredAssets.map(
                                (asset, index) => {

                                    const status =
                                        String(
                                            asset.status ||
                                            "UNKNOWN"
                                        ).toUpperCase();


                                    const assetName =
                                        asset.assetName ||
                                        asset.name ||
                                        `Asset ${index + 1}`;


                                    const assetType =
                                        asset.assetType ||
                                        "-";


                                    const hostname =
                                        asset.hostname ||
                                        "-";


                                    const ip =
                                        asset.ipAddress ||
                                        asset.ip ||
                                        "-";


                                    const cpu =
                                        getMetricValue(
                                            asset.cpuUsage ??
                                            asset.cpu
                                        );


                                    const memory =
                                        getMetricValue(
                                            asset.memoryUsage ??
                                            asset.memory
                                        );


                                    const disk =
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
                                                        md: 3,
                                                    },
                                                }}
                                            >

                                                <Stack
                                                    direction={{
                                                        xs: "column",
                                                        md: "row",
                                                    }}
                                                    spacing={3}
                                                    alignItems={{
                                                        md: "center",
                                                    }}
                                                >

                                                    {/* NAME */}

                                                    <Box
                                                        sx={{
                                                            flex: 1,
                                                        }}
                                                    >

                                                        <Stack
                                                            direction="row"
                                                            spacing={1.5}
                                                            alignItems="center"
                                                        >

                                                            <Box
                                                                sx={{
                                                                    width: 44,
                                                                    height: 44,
                                                                    borderRadius: 2,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    backgroundColor:
                                                                        "#f2f4f7",
                                                                    color:
                                                                        "#475467",
                                                                }}
                                                            >
                                                                <Computer />
                                                            </Box>


                                                            <Box>

                                                                <Typography
                                                                    fontWeight={700}
                                                                >
                                                                    {assetName}
                                                                </Typography>


                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {assetType}
                                                                    {" • "}
                                                                    {hostname}
                                                                    {" • "}
                                                                    {ip}
                                                                </Typography>

                                                            </Box>

                                                        </Stack>

                                                    </Box>


                                                    {/* STATUS */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 100,
                                                        }}
                                                    >

                                                        <Chip
                                                            size="small"
                                                            label={status}
                                                            color={getStatusColor(
                                                                status
                                                            )}
                                                        />

                                                    </Box>


                                                    {/* CPU */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 80,
                                                        }}
                                                    >

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            CPU
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={600}
                                                        >
                                                            {cpu}%
                                                        </Typography>

                                                    </Box>


                                                    {/* MEMORY */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 80,
                                                        }}
                                                    >

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Memory
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={600}
                                                        >
                                                            {memory}%
                                                        </Typography>

                                                    </Box>


                                                    {/* DISK */}

                                                    <Box
                                                        sx={{
                                                            minWidth: 80,
                                                        }}
                                                    >

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            Disk
                                                        </Typography>

                                                        <Typography
                                                            fontWeight={600}
                                                        >
                                                            {disk}%
                                                        </Typography>

                                                    </Box>

                                                </Stack>

                                            </Box>


                                            {index <
                                                filteredAssets.length - 1 && (
                                                    <Divider />
                                                )}

                                        </Box>
                                    );
                                }
                            )}

                        </Box>

                    )}

                </Card>

            </Container>

        </Box>
    );
}


export default Assets;