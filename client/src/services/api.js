import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://safe-surf-ai.onrender.com/api',
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
