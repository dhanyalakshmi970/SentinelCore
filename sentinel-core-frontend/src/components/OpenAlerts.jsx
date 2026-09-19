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
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    CheckCircle,
    Error as ErrorIcon,
    Refresh,
    Search,
    Warning,
} from "@mui/icons-material";

import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";


// ============================================================
// HELPER
// ============================================================

const getSeverityColor = (severity) => {

    switch (
        String(severity).toUpperCase()
        ) {

        case "CRITICAL":
            return "error";

        case "HIGH":
            return "error";

        case "MEDIUM":
            return "warning";

        case "LOW":
            return "info";

        case "WARNING":
            return "warning";

        default:
            return "default";
    }
};


// ============================================================
// OPEN ALERTS
// ============================================================

function OpenAlerts() {

    const navigate = useNavigate();

    const { logout } = useAuth();


    const [alerts, setAlerts] = useState([]);

    const [search, setSearch] = useState("");

    const [severityFilter, setSeverityFilter] =
        useState("ALL");

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD ALERTS
    // ========================================================

    const loadAlerts = async () => {

        try {

            setRefreshing(true);
            setError("");


            const response =
                await axiosClient.get(
                    "/api/alerts/open"
                );


            setAlerts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Alerts loading error:",
                err
            );

            setError(
                "Unable to load open alerts."
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

        loadAlerts();

    }, []);


    // ========================================================
    // SEARCH + FILTER
    // ========================================================

    const filteredAlerts =
        alerts.filter((alert) => {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            const severity =
                String(
                    alert.severity ||
                    ""
                ).toUpperCase();


            const message =
                String(
                    alert.message ||
                    alert.description ||
                    ""
                ).toLowerCase();


            const assetName =
                String(
                    alert.assetName ||
                    alert.asset?.assetName ||
                    alert.asset?.name ||
                    ""
                ).toLowerCase();


            const ipAddress =
                String(
                    alert.asset?.ipAddress ||
                    alert.ipAddress ||
                    ""
                ).toLowerCase();


            const matchesSearch =
                !searchText ||
                message.includes(searchText) ||
                assetName.includes(searchText) ||
                ipAddress.includes(searchText) ||
                severity
                    .toLowerCase()
                    .includes(searchText);


            const matchesSeverity =
                severityFilter === "ALL" ||
                severity === severityFilter;


            return (
                matchesSearch &&
                matchesSeverity
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
                        Loading open alerts...
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
                            Open Alerts
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Monitor infrastructure issues
                            requiring attention
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


                        <Button
                            variant="outlined"
                            startIcon={
                                refreshing
                                    ? <CircularProgress size={16} />
                                    : <Refresh />
                            }
                            onClick={loadAlerts}
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
                                onClick={loadAlerts}
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
                    SEARCH + SEVERITY FILTER
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
                                placeholder="Search by asset, IP address, alert message or severity..."
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
                                    "CRITICAL",
                                    "HIGH",
                                    "MEDIUM",
                                    "LOW",
                                ].map((severity) => (

                                    <Button
                                        key={severity}
                                        size="small"
                                        variant={
                                            severityFilter === severity
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() =>
                                            setSeverityFilter(
                                                severity
                                            )
                                        }
                                        sx={{
                                            textTransform:
                                                "none",
                                        }}
                                    >
                                        {severity === "ALL"
                                            ? "All"
                                            : severity}
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
                            {filteredAlerts.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {alerts.length}
                        </strong>{" "}
                        open alerts
                    </Typography>


                    <Chip
                        label={`${alerts.length} active`}
                        color={
                            alerts.length > 0
                                ? "warning"
                                : "success"
                        }
                    />

                </Stack>


                {/* ==================================================
                    ALERT LIST
                ================================================== */}

                {filteredAlerts.length === 0 ? (

                    <Card
                        sx={{
                            borderRadius: 3,
                            textAlign: "center",
                            py: 8,
                            px: 2,
                        }}
                    >

                        <CheckCircle
                            sx={{
                                fontSize: 55,
                                color: "success.main",
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ mt: 1 }}
                        >
                            All Systems Clear
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No open alerts match your
                            search or filter.
                        </Typography>

                    </Card>

                ) : (

                    <Stack spacing={2}>

                        {filteredAlerts.map(
                            (alert, index) => {

                                const severity =
                                    String(
                                        alert.severity ||
                                        "WARNING"
                                    ).toUpperCase();


                                const assetName =
                                    alert.assetName ||
                                    alert.asset?.assetName ||
                                    alert.asset?.name ||
                                    `Alert #${
                                        alert.id ||
                                        index + 1
                                    }`;


                                const message =
                                    alert.message ||
                                    alert.description ||
                                    "Infrastructure issue detected";


                                const ipAddress =
                                    alert.asset?.ipAddress ||
                                    alert.ipAddress ||
                                    "";


                                return (

                                    <Card
                                        key={
                                            alert.id ||
                                            index
                                        }
                                        sx={{
                                            borderRadius: 3,

                                            borderLeft:
                                                severity ===
                                                "CRITICAL"
                                                    ? "5px solid #dc2626"
                                                    : severity ===
                                                    "HIGH"
                                                        ? "5px solid #ef4444"
                                                        : "5px solid #f59e0b",

                                            transition:
                                                "all 0.2s ease",

                                            "&:hover": {
                                                boxShadow:
                                                    "0 8px 24px rgba(16,24,40,0.10)",
                                            },
                                        }}
                                    >

                                        <CardContent>

                                            <Stack
                                                direction={{
                                                    xs: "column",
                                                    md: "row",
                                                }}
                                                justifyContent="space-between"
                                                spacing={2}
                                            >

                                                <Box>

                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        alignItems="center"
                                                        flexWrap="wrap"
                                                        useFlexGap
                                                    >

                                                        {severity ===
                                                        "CRITICAL" ? (
                                                            <ErrorIcon
                                                                color="error"
                                                            />
                                                        ) : (
                                                            <Warning
                                                                color="warning"
                                                            />
                                                        )}


                                                        <Typography
                                                            fontWeight={700}
                                                        >
                                                            {assetName}
                                                        </Typography>


                                                        <Chip
                                                            size="small"
                                                            label={
                                                                severity
                                                            }
                                                            color={getSeverityColor(
                                                                severity
                                                            )}
                                                        />

                                                    </Stack>


                                                    {ipAddress && (
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            sx={{
                                                                display:
                                                                    "block",
                                                                mt: 0.5,
                                                            }}
                                                        >
                                                            IP Address:{" "}
                                                            {ipAddress}
                                                        </Typography>
                                                    )}


                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            mt: 1,
                                                        }}
                                                    >
                                                        {message}
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
                            }
                        )}

                    </Stack>

                )}

            </Container>

        </Box>
    );
}


export default OpenAlerts;