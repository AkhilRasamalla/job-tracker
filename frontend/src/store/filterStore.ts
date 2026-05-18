import { create } from 'zustand';
import { ApplicationStatus } from '../types';

interface FilterState {
  statusFilter: ApplicationStatus | 'All';
  setStatusFilter: (status: ApplicationStatus | 'All') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  statusFilter: 'All',
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
