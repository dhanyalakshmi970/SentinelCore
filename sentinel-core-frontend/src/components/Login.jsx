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


function Login({ onLoginSuccess }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const { loginUser } = useAuth();


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            const res = await login(
                username,
                password
            );

            const accessToken =
                res.data.accessToken;

            const refreshToken =
                res.data.refreshToken;


            // Save tokens
            localStorage.setItem(
                "accessToken",
                accessToken
            );

            localStorage.setItem(
                "refreshToken",
                refreshToken
            );


            // Store user authentication information
            loginUser(
                accessToken,
                refreshToken
            );


            // Tell App.jsx login was successful
            onLoginSuccess();

        } catch (err) {

            console.error(
                "Login Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Invalid username or password"
            );
        }
    };


    return (

        <Card
            style={{
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

                    <Alert severity="error">
                        {error}
                    </Alert>

                )}


                <form onSubmit={handleSubmit}>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />


                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{
                            marginTop: 16
                        }}
                    >
                        Log In
                    </Button>

                </form>

            </CardContent>

        </Card>
    );
}


export default Login;