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
    Apple,
    Security,
} from "@mui/icons-material";

import { register } from "../api/authApi";


function Register() {

    const navigate = useNavigate();


    const [firstName, setFirstName] =
        useState("");

    const [lastName, setLastName] =
        useState("");

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [termsAccepted, setTermsAccepted] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // REGISTER
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!firstName.trim()) {
            setError("Please enter your first name.");
            return;
        }


        if (!lastName.trim()) {
            setError("Please enter your last name.");
            return;
        }


        if (!username.trim()) {
            setError("Please enter a username.");
            return;
        }


        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }


        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }


        if (password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }


        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }


        if (!termsAccepted) {
            setError(
                "Please accept the Terms & Conditions."
            );
            return;
        }


        setLoading(true);


        try {

            await register({
                firstName,
                lastName,
                username,
                email,
                password,
            });


            setSuccess(
                "Account created successfully! Redirecting to login..."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to create account. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // GOOGLE REGISTER
    // ==========================================

    const handleGoogleRegister = () => {

        setError(
            "Google registration will be available after Google OAuth is configured."
        );

    };


    // ==========================================
    // APPLE REGISTER
    // ==========================================

    const handleAppleRegister = () => {

        setError(
            "Apple registration is not configured yet."
        );

    };


    return (

        <Box className="auth-page">

            <Paper
                elevation={0}
                className="auth-card register-card"
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
                                Your enterprise
                                infrastructure,
                                visible and under control.
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <Box className="auth-form-section">

                    <Box className="auth-form-container register-form">

                        <Typography
                            variant="h3"
                            className="auth-title"
                        >
                            Create an account
                        </Typography>


                        <Typography
                            className="auth-subtitle"
                        >
                            Already have an account?{" "}

                            <Button
                                variant="text"
                                onClick={() =>
                                    navigate("/login")
                                }
                                sx={{
                                    textTransform:
                                        "none",
                                    fontWeight: 700,
                                    padding: 0,
                                    minWidth: "auto",
                                }}
                            >
                                Log in
                            </Button>

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


                        {/* SUCCESS */}

                        {success && (

                            <Alert
                                severity="success"
                                sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                {success}
                            </Alert>

                        )}


                        {/* ================================= */}
                        {/* REGISTER FORM */}
                        {/* ================================= */}

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                        >

                            {/* FIRST + LAST NAME */}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: 2,
                                }}
                            >

                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={firstName}
                                    onChange={(event) =>
                                        setFirstName(
                                            event.target.value
                                        )
                                    }
                                    margin="normal"
                                />


                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(event) =>
                                        setLastName(
                                            event.target.value
                                        )
                                    }
                                    margin="normal"
                                />

                            </Box>


                            {/* EMAIL */}

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                margin="normal"
                            />


                            {/* USERNAME */}

                            <TextField
                                fullWidth
                                label="Username"
                                value={username}
                                onChange={(event) =>
                                    setUsername(
                                        event.target.value
                                    )
                                }
                                margin="normal"
                            />


                            {/* PASSWORD */}

                            <TextField
                                fullWidth
                                label="Password"
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


                            {/* CONFIRM PASSWORD */}

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
                                                edge="end"
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


                            {/* TERMS */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems:
                                        "flex-start",
                                    gap: 1,
                                    mt: 2,
                                }}
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        termsAccepted
                                    }
                                    onChange={(event) =>
                                        setTermsAccepted(
                                            event.target.checked
                                        )
                                    }
                                    style={{
                                        marginTop: 4,
                                        width: 16,
                                        height: 16,
                                        cursor: "pointer",
                                    }}
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    I agree to the{" "}

                                    <span
                                        className="terms-link"
                                    >
                                        Terms & Conditions
                                    </span>

                                </Typography>

                            </Box>


                            {/* CREATE ACCOUNT */}

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
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
                                    "Create account"
                                )}

                            </Button>

                        </Box>


                        {/* ================================= */}
                        {/* SOCIAL */}
                        {/* ================================= */}

                        <Divider
                            sx={{
                                my: 2.5,
                            }}
                        >
                            Or register with
                        </Divider>


                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: 1.5,
                            }}
                        >

                            <Button
                                variant="outlined"
                                startIcon={<Google />}
                                onClick={
                                    handleGoogleRegister
                                }
                                className="social-button"
                            >
                                Google
                            </Button>


                            <Button
                                variant="outlined"
                                startIcon={<Apple />}
                                onClick={
                                    handleAppleRegister
                                }
                                className="social-button"
                            >
                                Apple
                            </Button>

                        </Box>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
}

export default Register;