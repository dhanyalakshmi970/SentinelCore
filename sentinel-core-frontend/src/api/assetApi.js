import axiosClient from "./axiosClient";

export const getAllAssets = () => {
    return axiosClient.get("/api/assets/getAll");
};

export const getDashboardSummary = () => {
    return axiosClient.get("/api/assets/dashboard/summary");
};