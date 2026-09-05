import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

axiosClient.interceptors.request.use(
    (config) => {

        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {

            config.headers =
                config.headers || {};

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

axiosClient.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest =
            error.config;


        // No response from backend
        if (!error.response) {

            return Promise.reject(error);
        }


        // ======================================
        // Don't refresh login/refresh endpoints
        // ======================================

        if (
            originalRequest?.url?.includes(
                "/api/auth/login"
            ) ||
            originalRequest?.url?.includes(
                "/api/auth/refresh"
            )
        ) {

            return Promise.reject(error);
        }


        // ======================================
        // Access token expired
        // ======================================

        if (
            (error.response.status === 401 ||
                error.response.status === 403) &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;


            try {

                const refreshToken =
                    localStorage.getItem(
                        "refreshToken"
                    );


                if (!refreshToken) {

                    throw new Error(
                        "Refresh token not found"
                    );
                }


                // ==================================
                // Request new access token
                // ==================================

                const refreshResponse =
                    await axios.post(
                        "http://localhost:8080/api/auth/refresh",
                        {
                            refreshToken
                        }
                    );


                const newAccessToken =
                    refreshResponse.data.accessToken;


                const newRefreshToken =
                    refreshResponse.data.refreshToken;


                if (!newAccessToken) {

                    throw new Error(
                        "New access token not received"
                    );
                }


                // ==================================
                // Save new tokens
                // ==================================

                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );


                if (newRefreshToken) {

                    localStorage.setItem(
                        "refreshToken",
                        newRefreshToken
                    );

                }


                // ==================================
                // Retry original request
                // ==================================

                originalRequest.headers =
                    originalRequest.headers || {};

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                return axiosClient(
                    originalRequest
                );

            } catch (refreshError) {

                console.error(
                    "Refresh token failed:",
                    refreshError
                );


                // ==================================
                // Completely logout
                // ==================================

                localStorage.removeItem(
                    "accessToken"
                );

                localStorage.removeItem(
                    "refreshToken"
                );


                window.location.reload();


                return Promise.reject(
                    refreshError
                );
            }
        }


        return Promise.reject(error);
    }
);


export default axiosClient;