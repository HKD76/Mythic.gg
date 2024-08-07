import apiClient from "./apiClient";

export const getRecentMatches = async (puuid) => {
  const response = await apiClient.get(`/recent-matches/${puuid}`);
  return response.data;
};

export const getMatchDetails = async (matchId) => {
  const response = await apiClient.get(`/match-details/${matchId}`);
  return response.data;
};

export const getStatsByRank = async (rank) => {
  const response = await apiClient.get(`/stats/rank/${rank}`);
  return response.data;
};
