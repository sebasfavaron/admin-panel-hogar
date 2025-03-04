import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { donationAPI } from '../services/api';
import { Donation } from '../types/models';

export const useDonations = () => {
  return useQuery({
    queryKey: ['donations'],
    queryFn: donationAPI.getAll,
  });
};

export const useDonation = (id: string | undefined) => {
  return useQuery({
    queryKey: ['donations', id],
    queryFn: () => donationAPI.getById(id || ''),
    enabled: !!id,
  });
};

export const useDonationsByCollaborator = (
  collaboratorId: string | undefined
) => {
  return useQuery({
    queryKey: ['donations', 'collaborator', collaboratorId],
    queryFn: () => donationAPI.getByCollaborator(collaboratorId || ''),
    enabled: !!collaboratorId,
  });
};

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) =>
      donationAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    },
  });
};

export const useUpdateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Donation> }) =>
      donationAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    },
  });
};

export const useDeleteDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: donationAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
    },
  });
};
