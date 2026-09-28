import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Alert,
} from "@mui/material";

import axiosClient from "../api/axiosClient";

function AddAsset() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        assetName: "",
        assetType: "",
        ipAddress: "",
        cpuUsage: "",
        memoryUsage: "",
        diskUsage: "",
        networkUsage: "",
        status: "ONLINE",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit asset
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Convert numeric fields from strings to numbers
            const payload = {
                assetName: formData.assetName.trim(),
                assetType: formData.assetType,
                ipAddress: formData.ipAddress.trim(),
                cpuUsage: Number(formData.cpuUsage),
                memoryUsage: Number(formData.memoryUsage),
                diskUsage: Number(formData.diskUsage),
                networkUsage: Number(formData.networkUsage),
                status: formData.status,
            };

            console.log("Sending asset payload:", payload);

            // Send data to Spring Boot backend
            await axiosClient.post("/api/assets", payload);

            setSuccess("Asset added successfully!");

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);

        } catch (err) {
            console.error("Error adding asset:", err);

            if (err.response?.status === 403) {
                setError(
                    "Access denied. Only administrators can add assets."
                );
            } else if (err.response?.status === 400) {
                setError(
                    err.response?.data?.message ||
                    "Invalid asset data. Please check your inputs."
                );
            } else if (err.response?.status === 401) {
                setError(
                    "Your session has expired. Please login again."
                );
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to add asset. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 3,
                }}
            >
                {/* Page Title */}
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                >
                    Add New Asset
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Enter the details of the enterprise asset.
                </Typography>

                {/* Error Message */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Success Message */}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {/* Add Asset Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "grid",
                        gap: 2,
                    }}
                >
                    {/* Asset Name */}
                    <TextField
                        label="Asset Name"
                        name="assetName"
                        value={formData.assetName}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    {/* Asset Type */}
                    <TextField
                        select
                        label="Asset Type"
                        name="assetType"
                        value={formData.assetType}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="SERVER">
                            Server
                        </MenuItem>

                        <MenuItem value="DATABASE">
                            Database
                        </MenuItem>

                        <MenuItem value="APPLICATION">
                            Application
                        </MenuItem>

                        <MenuItem value="NETWORK">
                            Network Device
                        </MenuItem>

                        <MenuItem value="WORKSTATION">
                            Workstation
                        </MenuItem>
                    </TextField>

                    {/* IP Address */}
                    <TextField
                        label="IP Address"
                        name="ipAddress"
                        value={formData.ipAddress}
                        onChange={handleChange}
                        required
                        fullWidth
                        placeholder="Example: 192.168.1.103"
                    />

                    {/* CPU Usage */}
                    <TextField
                        label="CPU Usage (%)"
                        name="cpuUsage"
                        type="number"
                        value={formData.cpuUsage}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            max: 100,
                        }}
                        required
                        fullWidth
                    />

                    {/* Memory Usage */}
                    <TextField
                        label="Memory Usage (%)"
                        name="memoryUsage"
                        type="number"
                        value={formData.memoryUsage}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            max: 100,
                        }}
                        required
                        fullWidth
                    />

                    {/* Disk Usage */}
                    <TextField
                        label="Disk Usage (%)"
                        name="diskUsage"
                        type="number"
                        value={formData.diskUsage}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            max: 100,
                        }}
                        required
                        fullWidth
                    />

                    {/* Network Usage */}
                    <TextField
                        label="Network Usage"
                        name="networkUsage"
                        type="number"
                        value={formData.networkUsage}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                        }}
                        required
                        fullWidth
                    />

                    {/* Status */}
                    <TextField
                        select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        fullWidth
                    >
                        <MenuItem value="ONLINE">
                            Online
                        </MenuItem>

                        <MenuItem value="WARNING">
                            Warning
                        </MenuItem>

                        <MenuItem value="CRITICAL">
                            Critical
                        </MenuItem>

                        <MenuItem value="OFFLINE">
                            Offline
                        </MenuItem>
                    </TextField>

                    {/* Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {loading ? "Adding..." : "Add Asset"}
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate("/dashboard")}
                            sx={{
                                textTransform: "none",
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default AddAsset;