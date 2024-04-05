import axios from 'axios';
import { API_URL } from '@env';

import { storage } from '~/services/mmkv';
import { api } from '..';

console.log(`[API Client] initiated with endpoint: ${API_URL}`);

const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
axiosApi.interceptors.request.use(
  async (config) => {
    if (
      config.url?.startsWith('/register') ||
      config.url?.startsWith('/auth/login') ||
      config.url?.startsWith('/auth/refresh')
    ) {
      return config;
    }

    const tokens = storage.auth.getUserTokens();
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
axiosApi.interceptors.request.use((request) => {
  console.log(`[API Request] ${request.method?.toUpperCase()} ${request.url}`);
  return request;
});
// Response interceptor for API calls
axiosApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await api.auth.refreshAccessToken();
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      return axiosApi(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default axiosApi;
