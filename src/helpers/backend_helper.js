import { APIClient } from "./api_helper";

const api = new APIClient();


export const getClubApi = (data) => api.get(`/club`, data);
export const addNewClubApi = (data) => api.post(`/club`, data);
export const updateClubApi = (data) => api.patch(`/club`, data);
export const deleteClubApi = (data) => api.delete(`/club`, data);

export const getScoreApi = (data) => api.get(`/score`, data);
export const addNewScoreApi = (data) => api.post(`/score`, data);
export const updateScoreApi = (data) => api.patch(`/score`, data);
export const deleteScoreApi = (data) => api.delete(`/score`, data);
