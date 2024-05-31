// src/api/dataService.js
import apiClient from './apiClient';

export const fetchData = async () => {
  try {
    const response = await apiClient.get('/data');
    return response.data;
  } catch (error) {
    throw error;
  }
};
