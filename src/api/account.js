import apiClient from "./apiClient";

export const getAccountByRiotID = async (username, tag) => {
  const response = await apiClient.get(`/account/${username}/${tag}`);
  return response.data;
};

export const getAccountByPUUID = async (puuid) => {
  const response = await apiClient.get(`/account-puuid/${puuid}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await apiClient.get(`/search-users?query=${query}`);
  return response.data;
};
