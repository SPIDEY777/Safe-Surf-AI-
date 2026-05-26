export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' 
  ? 'https://safe-surf-ai.onrender.com' 
  : 'http://localhost:5000');
