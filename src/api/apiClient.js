import axios from 'axios';
import { Platform } from 'react-native';

// Adjust the baseURL according to the platform and your development environment
const baseURL = Platform.OS === 'ios' ? 'http://localhost:3000/summoner' : 'http://10.0.2.2:3000/summoner';

const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;
