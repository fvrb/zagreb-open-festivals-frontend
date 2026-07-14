import type { AuthResponse, CurrentUser } from '../types';
import { api, plainApi } from './api';
import { clearAuth, saveAuth } from './tokenStorage';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  email: string;
}

export const authService = {
  async login(payload: LoginRequest) {
    const { data } = await plainApi.post<AuthResponse>('/auth/login', payload);
    saveAuth(data);
    return data;
  },

  async register(payload: RegisterRequest) {
    await plainApi.post('/auth/register', payload);
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
    }
  },

  async me() {
    const { data } = await api.get<CurrentUser>('/users/me');
    return data;
  },
};
