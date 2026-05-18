import api from './api';
import { AuthResponse } from '../types';

// Login a user
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

// Register a new user
export const registerUser = async (userData: { name: string; email: string; password: string }) => {
  const response = await api.post<AuthResponse>('/auth/register', userData);
  return response.data;
};

// Get current logged-in user profile
export const getMe = async () => {
  const response = await api.get<{ user: AuthResponse['user'] }>('/auth/me');
  return response.data.user;
};
