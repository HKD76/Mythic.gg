import axios from "axios";

export const getChampionData = async () => {
  const response = await axios.get(
    `https://ddragon.leagueoflegends.com/cdn/14.12.1/data/en_US/champion.json`
  );
  return response.data.data;
};
