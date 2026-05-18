import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('job-tracker-token'),
  isAuthenticated: !!localStorage.getItem('job-tracker-token'),
  isLoading: true, // Initially true while we verify the token

  setAuth: (user, token) => {
    localStorage.setItem('job-tracker-token', token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('job-tracker-token');
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  initialize: () => {
    const token = localStorage.getItem('job-tracker-token');
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
    }
    // Note: We don't verify token validity here, we just check existence.
    // The App component will use getMe to fetch user data and verify token if it exists.
  },
}));
