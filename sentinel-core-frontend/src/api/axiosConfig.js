import axios from "axios";
import { refreshAccessToken } from "./authApi";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

let currentAccessToken = null;
let currentRefreshToken = null;

export const setTokens = (access, refresh) => {
    currentAccessToken = access;
    currentRefreshToken = refresh;
};

api.interceptors.request.use((config) => {

    if (currentAccessToken) {
        config.headers.Authorization =
            `Bearer ${currentAccessToken}`;
    }

    return config;
});

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const res =
                    await refreshAccessToken(currentRefreshToken);

                currentAccessToken =
                    res.data.accessToken;

                originalRequest.headers.Authorization =
                    `Bearer ${currentAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                window.location.reload();
            }
        }

        return Promise.reject(error);
    }
);

export default api;