import apiClient from "./apiClient";

export const getRankedStats = async (summonerId) => {
  const response = await apiClient.get(`/ranked-stats/${summonerId}`);
  return response.data.filter((entry) => entry.queueType === "RANKED_SOLO_5x5");
};
