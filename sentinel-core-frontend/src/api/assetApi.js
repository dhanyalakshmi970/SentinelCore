import axiosClient from "./axiosClient";

export const getAllAssets = () => {
    return axiosClient.get("/api/assets");
};

export const getDashboardSummary = () => {
    return axiosClient.get("/api/assets/dashboard/summary");
};