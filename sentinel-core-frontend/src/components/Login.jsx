import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
    Google,
    Security,
} from "@mui/icons-material";

import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { loginUser } = useAuth();

    //username
    const [usernameOrEmail, setUsernameOrEmail] =
        useState("");

    //password
    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // LOGIN
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!usernameOrEmail.trim()) {
            setError("Please enter your username or email.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {

            const response = await login(
                usernameOrEmail,
                password
            );

            const accessToken =
                response.data.accessToken;

            const refreshToken =
                response.data.refreshToken;

            if (!accessToken) {
                throw new Error(
                    "Access token was not received."
                );
            }

            loginUser(
                accessToken,
                refreshToken
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Invalid username/email or password."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GOOGLE LOGIN
    // ==========================================



    return (

        <Box className="auth-page">

            <Paper
                elevation={0}
                className="auth-card"
            >

                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <Box className="auth-visual">

                    <Box className="visual-overlay" />

                    <Box className="visual-content">

                        <Box className="brand-logo">

                            <Security />

                            <Typography
                                variant="h5"
                                fontWeight={800}
                            >
                                SENTINELCORE
                            </Typography>

                        </Box>


                        <Box className="visual-bottom">

                            <Typography
                                variant="h3"
                                fontWeight={800}
                                className="visual-title"
                            >
                                Monitor Systems,
                                <br />
                                Not Just Metrics.
                            </Typography>


                            <Typography
                                className="visual-description"
                            >
                                Securely monitor your
                                enterprise infrastructure
                                from one powerful platform.
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <Box className="auth-form-section">

                    <Box className="auth-form-container">

                        <Typography
                            variant="h3"
                            className="auth-title"
                        >
                            Welcome back
                        </Typography>


                        <Typography
                            className="auth-subtitle"
                        >
                            Sign in to your SentinelCore
                            account
                        </Typography>


                        {/* ERROR */}

                        {error && (

                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                {error}
                            </Alert>

                        )}


                        {/* ================================= */}
                        {/* FORM */}
                        {/* ================================= */}

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >

                            <TextField
                                fullWidth
                                label="Email or Username"
                                placeholder="Enter your email or username"
                                value={usernameOrEmail}
                                onChange={(event) =>
                                    setUsernameOrEmail(
                                        event.target.value
                                    )
                                }
                                margin="normal"
                                autoComplete="username"
                            />


                            <TextField
                                fullWidth
                                label="Password"
                                placeholder="Enter your password"
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
                                autoComplete="current-password"

                                InputProps={{
                                    endAdornment: (

                                        <InputAdornment position="end">

                                            <IconButton
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                edge="end"
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


                            {/* FORGOT PASSWORD */}

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "flex-end",
                                    mt: 1,
                                }}
                            >

                                <Button
                                    variant="text"
                                    onClick={() =>
                                        navigate(
                                            "/forgot-password"
                                        )
                                    }
                                    sx={{
                                        textTransform:
                                            "none",
                                        fontWeight: 600,
                                    }}
                                >
                                    Forgot password?
                                </Button>

                            </Box>


                            {/* LOGIN BUTTON */}

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                className="primary-auth-button"
                            >

                                {loading ? (

                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />

                                ) : (
                                    "Sign In"
                                )}

                            </Button>

                        </Box>


                        {/* ================================= */}
                        {/* DIVIDER */}
                        {/* ================================= */}




                        {/* ================================= */}
                        {/* GOOGLE */}
                        {/* ================================= */}



                        {/* ================================= */}
                        {/* REGISTER */}
                        {/* ================================= */}

                        <Box
                            sx={{
                                textAlign: "center",
                                mt: 3,
                            }}
                        >

                            <Typography
                                component="span"
                                color="text.secondary"
                            >
                                Don't have an account?{" "}
                            </Typography>

                            <Button
                                variant="text"
                                onClick={() =>
                                    navigate("/register")
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                }}
                            >
                                Create account
                            </Button>

                        </Box>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
}

export default Login;