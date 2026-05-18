import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services';
import { JobApplication, ApplicationPayload } from '../types';

const QUERY_KEY = ['applications'];

export const useApplications = () => {
  return useQuery<JobApplication[], Error>({
    queryKey: QUERY_KEY,
    queryFn: applicationService.getApplications,
  });
};

export const useApplication = (id: string) => {
  return useQuery<JobApplication, Error>({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<JobApplication, Error, ApplicationPayload>({
    mutationFn: applicationService.createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<JobApplication, Error, { id: string; payload: Partial<ApplicationPayload> }>({
    mutationFn: ({ id, payload }) => applicationService.updateApplication(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.setQueryData([...QUERY_KEY, data._id], data);
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: applicationService.deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
