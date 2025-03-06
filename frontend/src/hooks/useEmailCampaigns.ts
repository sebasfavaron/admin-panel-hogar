import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emailCampaignAPI } from '../services/api';
import type { EmailCampaign, CampaignFilter } from '../types/models';

export const useEmailCampaigns = () => {
  return useQuery({
    queryKey: ['emailCampaigns'],
    queryFn: emailCampaignAPI.getAll,
  });
};

export const useEmailCampaign = (id: string | undefined) => {
  return useQuery({
    queryKey: ['emailCampaign', id],
    queryFn: () => (id ? emailCampaignAPI.getById(id) : null),
    enabled: !!id,
  });
};

export const useCreateEmailCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<
        EmailCampaign,
        'id' | 'createdAt' | 'updatedAt' | 'sent_at' | 'recipient_count'
      >
    ) => emailCampaignAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
};

export const useUpdateEmailCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmailCampaign> }) =>
      emailCampaignAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
};

export const useDeleteEmailCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: emailCampaignAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
};

export const useSendEmailCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, filters }: { id: string; filters?: CampaignFilter }) =>
      emailCampaignAPI.send(id, filters),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailCampaigns'] });
    },
  });
};

export const usePreviewRecipients = () => {
  return useMutation({
    mutationFn: (filters?: CampaignFilter) =>
      emailCampaignAPI.previewRecipients(filters),
  });
};
