import { useState } from "react";

import { login } from "../api/authApi";

import { useAuth } from "../context/AuthContext";

import {
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    Alert
} from "@mui/material";


function Login() {


    const [username, setUsername] =
        useState("");


    const [password, setPassword] =
        useState("");


    const [error, setError] =
        useState("");


    const [loading, setLoading] =
        useState(false);


    const {
        loginUser
    } = useAuth();


    // ==========================================
    // Login Submit
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const res =
                await login(
                    username,
                    password
                );


            const accessToken =
                res.data.accessToken;


            const refreshToken =
                res.data.refreshToken;


            if (!accessToken) {

                throw new Error(
                    "Access token not received"
                );

            }


            // Store authentication

            loginUser(
                accessToken,
                refreshToken
            );


        } catch (err) {

            console.error(
                "Login Error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Invalid username or password"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <Card
            sx={{
                maxWidth: 400,
                margin: "100px auto"
            }}
        >

            <CardContent>

                <Typography
                    variant="h5"
                    gutterBottom
                >
                    SentinelCore Login
                </Typography>


                {error && (

                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                    >
                        {error}
                    </Alert>

                )}


                <form
                    onSubmit={handleSubmit}
                >


                    {/* Username */}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        required
                    />


                    {/* Password */}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                    />


                    {/* Login */}

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{
                            marginTop: 2
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Log In"}
                    </Button>


                </form>

            </CardContent>

        </Card>

    );

}


export default Login;