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

        const originalRequest = error.config;

        // If access token expired
        if (
            (error.response?.status === 401 ||
                error.response?.status === 403) &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                const refreshToken =
                    localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("Refresh token not found");
                }


                // Request new access token
                const response = await axios.post(
                    "http://localhost:8080/api/auth/refresh",
                    {
                        refreshToken: refreshToken
                    }
                );


                const newAccessToken =
                    response.data.accessToken;


                // Save new access token
                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );


                // Add new token to original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                // Retry original request
                return axiosClient(originalRequest);

            } catch (refreshError) {

                console.error(
                    "Refresh token failed:",
                    refreshError
                );

                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.reload();

                return Promise.reject(refreshError);
            }
        }


        return Promise.reject(error);
    }
);


export default axiosClient;