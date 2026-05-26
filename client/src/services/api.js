import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const scanUrl = async (url) => {
  const response = await api.post('/scan', { url });
  return response.data;
};

export const analyzeScam = async (message) => {
  const response = await api.post('/scam/analyze', { message });
  return response.data;
};

export const analyzeEmail = async (emailData) => {
  const response = await api.post('/email/analyze', emailData);
  return response.data;
};

export default api;
