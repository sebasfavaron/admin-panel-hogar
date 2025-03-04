import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collaboratorAPI } from '../services/api';
import { Collaborator } from '../types/models';

export const useCollaborators = () => {
  return useQuery({
    queryKey: ['collaborators'],
    queryFn: collaboratorAPI.getAll,
  });
};

export const useCollaborator = (id: string | undefined) => {
  return useQuery({
    queryKey: ['collaborators', id],
    queryFn: () => (id ? collaboratorAPI.getById(id) : null),
    enabled: !!id,
  });
};

export const useCreateCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Collaborator, 'id' | 'createdAt' | 'updatedAt'>) =>
      collaboratorAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    },
  });
};

export const useUpdateCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Collaborator> }) =>
      collaboratorAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    },
  });
};

export const useDeleteCollaborator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collaboratorAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    },
  });
};
