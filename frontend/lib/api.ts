// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    // Solo en el cliente (navegador)
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1];
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      if (typeof window !== 'undefined') {
        // Limpiar el token y redirigir al login
        document.cookie = 'auth-token=; Max-Age=0; path=/;';
        window.location.href = '/login?error=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;