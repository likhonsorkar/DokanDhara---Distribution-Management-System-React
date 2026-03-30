import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Helper to get from either storage
const getAuthItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

api.interceptors.request.use((config) => {
    const token = getAuthItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getAuthItem('refresh_token');
            if (refreshToken) {
                try {
                    const res = await axios.post('http://127.0.0.1:8000/api/auth/refresh/', {
                        refresh: refreshToken
                    });
                    const newAccessToken = res.data.access;
                    
                    // Determine which storage to update
                    const storage = localStorage.getItem('refresh_token') ? localStorage : sessionStorage;
                    storage.setItem('access_token', newAccessToken);
                    
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, clear everything and redirect to login
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;