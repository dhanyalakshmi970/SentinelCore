    import axios from "axios";

    const API_URL = "http://localhost:8080/api/auth";

    // ==========================================
    // LOGIN
    // ==========================================

    export const login = (usernameOrEmail, password) =>
        axios.post(`${API_URL}/login`, {
            usernameOrEmail,
            password,
        });


    // ==========================================
    // REGISTER
    // ==========================================

    export const register = (userData) =>
        axios.post(`${API_URL}/register`, userData);


    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    export const forgotPassword = (email) =>
        axios.post(`${API_URL}/forgot-password`, {
            email,
        });


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    export const resetPassword = (token, newPassword) =>
        axios.post(`${API_URL}/reset-password`, {
            token,
            newPassword,
        });


    // ==========================================
    // REFRESH TOKEN
    // ==========================================

    export const refreshAccessToken = (refreshToken) =>
        axios.post(`${API_URL}/refresh`, {
            refreshToken,
        });