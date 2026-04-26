import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // Primary: plain 'token' key set on login
  let token = localStorage.getItem('token');

  // Fallback: read from Zustand persisted state (after page refresh, 
  // Zustand rehydrates from 'auth-storage' but doesn't re-run setAuth)
  if (!token) {
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed?.state?.token ?? null;
        // Restore plain token key so future requests work
        if (token) localStorage.setItem('token', token);
      }
    } catch {
      // ignore parse errors
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
