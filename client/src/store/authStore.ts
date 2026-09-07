import { create } from 'zustand';
import { IUser } from '../types';
import { api } from '../lib/axios';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<IUser>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('taskverse_user') || 'null'),
  token: localStorage.getItem('taskverse_token'),
  isAuthenticated: !!localStorage.getItem('taskverse_token'),
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', credentials);
      const { user, accessToken } = res.data;
      localStorage.setItem('taskverse_token', accessToken);
      localStorage.setItem('taskverse_user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to login';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', userData);
      const { user, accessToken } = res.data;
      localStorage.setItem('taskverse_token', accessToken);
      localStorage.setItem('taskverse_user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('taskverse_token');
    localStorage.removeItem('taskverse_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('taskverse_token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const res = await api.get('/users/me');
      set({ user: res.data, isAuthenticated: true });
      localStorage.setItem('taskverse_user', JSON.stringify(res.data));
    } catch (err) {
      localStorage.removeItem('taskverse_token');
      localStorage.removeItem('taskverse_user');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.patch('/users/me', data);
      set({ user: res.data, isLoading: false });
      localStorage.setItem('taskverse_user', JSON.stringify(res.data));
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to update profile';
      set({ error: msg, isLoading: false });
      throw new Error(msg);
    }
  },
}));
