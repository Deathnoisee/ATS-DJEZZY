import axios from 'axios';

const api = axios.create({
  baseURL: '', // Vite proxy handles the domain
});

// Request interceptor: attach access token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 and refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // No refresh token => logout
        _logout();
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post('/auth/jwt/refresh/', {
          refresh: refreshToken,
        });
        // Store new access token
        localStorage.setItem('access_token', data.access);
        // Update the original request and retry it
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed => logout
        _logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

function _logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // Redirect to login (hard reload or push using router, but safe to reload)
  window.location.href = '/login';
}

export default api;