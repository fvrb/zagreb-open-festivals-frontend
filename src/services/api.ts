import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clearAuth, readAuth, saveAuth } from './tokenStorage';
import type { AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

interface RetriableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const plainApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const auth = readAuth();

  if (auth?.accessToken) {
    config.headers.Authorization = `${auth.tokenType} ${auth.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequest | undefined;
    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url?.startsWith('/auth/');

    if (!originalRequest || !isUnauthorized || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const { data } = await plainApi.post<AuthResponse>('/auth/refresh');
      saveAuth(data);
      originalRequest.headers.Authorization = `${data.tokenType} ${data.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuth();
      window.dispatchEvent(new Event('zof:auth-expired'));
      return Promise.reject(refreshError);
    }
  },
);
