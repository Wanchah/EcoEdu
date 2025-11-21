import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized: token missing or expired');
    }
    return Promise.reject(error);
  }
);

const api = {
  get: (url, config) => instance.get(url, config).then((res) => res.data),
  post: (url, body, config) => instance.post(url, body, config).then((res) => res.data),
  patch: (url, body, config) => instance.patch(url, body, config).then((res) => res.data),
  put: (url, body, config) => instance.put(url, body, config).then((res) => res.data),
  delete: (url, config) => instance.delete(url, config).then((res) => res.data),
};

export default api;