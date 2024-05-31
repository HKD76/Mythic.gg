import axios from 'axios';
import apiClient from './apiClient';

let riotApiClient;

const initializeRiotApiClient = async () => {
  try {
    const response = await apiClient.get('/riot-token');
    const riotToken = response.data.token;

    riotApiClient = axios.create({
      baseURL: 'https://europe.api.riotgames.com',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'X-Riot-Token': riotToken,
      },
    });

    riotApiClient.interceptors.request.use(
      request => {
        console.log('Starting Request', JSON.stringify(request, null, 2));
        return request;
      },
      error => {
        console.log('Request Error', JSON.stringify(error, null, 2));
        return Promise.reject(error);
      }
    );

    riotApiClient.interceptors.response.use(
      response => {
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
      },
      error => {
        console.log('Response Error:', JSON.stringify(error, null, 2));
        return Promise.reject(error);
      }
    );
  } catch (error) {
    console.error('Failed to fetch Riot API token:', error);
  }
};

export { initializeRiotApiClient, riotApiClient };
