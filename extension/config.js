// SafeSurf AI Chrome Extension Configuration
const ENV = 'production'; // Set to 'development' for local backend testing

const API_BASE_URL = ENV === 'production'
  ? 'https://safe-surf-ai.onrender.com'
  : 'http://localhost:5000';

const API_BASE = `${API_BASE_URL}/api`;
