import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    LockReset,
} from "@mui/icons-material";

import { forgotPassword } from "../api/authApi";


function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!email.trim()) {

            setError("Please enter your email address.");

            return;
        }


        if (!email.includes("@")) {

            setError("Please enter a valid email address.");

            return;
        }


        setLoading(true);


        try {

            await forgotPassword(email);

            setSuccess(
                "If an account exists with this email, a password reset link has been sent."
            );

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to process your request. Please try again."
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
                    Forgot password?
                </Typography>


                <Typography
                    color="text.secondary"
                    textAlign="center"
                    sx={{
                        mt: 1,
                        mb: 3,
                    }}
                >
                    Enter your email address and
                    we'll help you reset your password.
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
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        margin="normal"
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

                            "Send reset link"

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

export default ForgotPassword;