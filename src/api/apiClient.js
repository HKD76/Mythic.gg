import axios from "axios";
import { Platform } from "react-native";

const baseURL =
  Platform.OS === "ios"
    ? "http://localhost:3000/summoner"
    : "http://10.0.2.2:3000/summoner";

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
