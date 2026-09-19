import { useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    LockReset,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import { resetPassword } from "../api/authApi";


function ResetPassword() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const token =
        searchParams.get("token");


    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!token) {

            setError(
                "Invalid or missing reset token."
            );

            return;
        }


        if (password.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        setLoading(true);


        try {

            await resetPassword(
                token,
                password
            );


            setSuccess(
                "Password reset successfully. Redirecting to login..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1800);


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to reset password."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <Box className="simple-auth-page">

            <Paper
                elevation={0}
                className="forgot-card"
            >

                <Box className="forgot-icon">

                    <LockReset />

                </Box>


                <Typography
                    variant="h4"
                    fontWeight={800}
                    textAlign="center"
                >
                    Reset password
                </Typography>


                <Typography
                    color="text.secondary"
                    textAlign="center"
                    sx={{
                        mt: 1,
                        mb: 3,
                    }}
                >
                    Create a new secure password
                    for your account.
                </Typography>


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}


                {success && (

                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                    >
                        {success}
                    </Alert>

                )}


                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <TextField
                        fullWidth
                        label="New Password"
                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        margin="normal"
                        InputProps={{
                            endAdornment: (

                                <InputAdornment position="end">

                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >

                                        {showPassword
                                            ? <VisibilityOff />
                                            : <Visibility />
                                        }

                                    </IconButton>

                                </InputAdornment>

                            ),
                        }}
                    />


                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(
                                event.target.value
                            )
                        }
                        margin="normal"
                        InputProps={{
                            endAdornment: (

                                <InputAdornment position="end">

                                    <IconButton
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >

                                        {showConfirmPassword
                                            ? <VisibilityOff />
                                            : <Visibility />
                                        }

                                    </IconButton>

                                </InputAdornment>

                            ),
                        }}
                    />


                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        className="primary-auth-button"
                        sx={{
                            mt: 2,
                        }}
                    >

                        {loading ? (

                            <CircularProgress
                                size={24}
                                color="inherit"
                            />

                        ) : (
                            "Reset password"
                        )}

                    </Button>

                </Box>


                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/login")
                    }
                    sx={{
                        mt: 2,
                        textTransform: "none",
                    }}
                >
                    Back to login
                </Button>

            </Paper>

        </Box>
    );
}

export default ResetPassword;