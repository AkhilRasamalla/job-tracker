import api from './api';
import { JobApplication, ApplicationPayload } from '../types';

export const getApplications = async (): Promise<JobApplication[]> => {
  const response = await api.get<{ applications: JobApplication[] }>('/applications');
  return response.data.applications;
};

export const getApplicationById = async (id: string): Promise<JobApplication> => {
  const response = await api.get<{ application: JobApplication }>(`/applications/${id}`);
  return response.data.application;
};

export const createApplication = async (payload: ApplicationPayload): Promise<JobApplication> => {
  const response = await api.post<{ application: JobApplication }>('/applications', payload);
  return response.data.application;
};

export const updateApplication = async (
  id: string,
  payload: Partial<ApplicationPayload>
): Promise<JobApplication> => {
  const response = await api.put<{ application: JobApplication }>(`/applications/${id}`, payload);
  return response.data.application;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};
