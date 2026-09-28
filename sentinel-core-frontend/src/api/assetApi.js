import axiosClient from './axiosClient';
export const getAllAssets = () => axiosClient.get('/api/assets/getAll');
export const getDashboardSummary = () => axiosClient.get('/api/assets/dashboard/summary');
export const searchAssets = params => axiosClient.get('/api/assets/search',{params});
export const createAsset = data => axiosClient.post('/api/assets',data);
export const getAsset = id => axiosClient.get(`/api/assets/${id}`);
