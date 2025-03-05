import axios, { AxiosError } from 'axios';
import {
  Collaborator,
  Donation,
  EmailCampaign,
  CampaignFilter,
} from '../types/models';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

const api = axios.create({
  baseURL: API_URL,
});

interface ApiErrorResponse {
  error: string;
  details?: string;
}

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const apiError = error as AxiosError<ApiErrorResponse>;
    throw new Error(apiError.response?.data?.error || apiError.message);
  }
  throw error;
};

export const collaboratorAPI = {
  getAll: () =>
    api.get<Collaborator[]>('/collaborators').then((res) => res.data),
  getById: (id: string) =>
    api.get<Collaborator>(`/collaborators/${id}`).then((res) => res.data),
  create: (data: Omit<Collaborator, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Collaborator>('/collaborators', data).then((res) => res.data),
  update: (id: string, data: Partial<Collaborator>) =>
    api.put<Collaborator>(`/collaborators/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/collaborators/${id}`),
};

export const donationAPI = {
  getAll: () => api.get<Donation[]>('/donations').then((res) => res.data),
  getById: (id: string) =>
    api.get<Donation>(`/donations/${id}`).then((res) => res.data),
  getByCollaborator: (collaboratorId: string) =>
    api
      .get<Donation[]>(`/donations/collaborator/${collaboratorId}`)
      .then((res) => res.data),
  create: (data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Donation>('/donations', data).then((res) => res.data),
  update: (id: string, data: Partial<Donation>) =>
    api.put<Donation>(`/donations/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/donations/${id}`),
};

export const emailCampaignAPI = {
  getAll: () =>
    api
      .get<EmailCampaign[]>('/email-campaigns')
      .then((res) => res.data)
      .catch(handleApiError),

  getById: (id: string) =>
    api
      .get<EmailCampaign>(`/email-campaigns/${id}`)
      .then((res) => res.data)
      .catch(handleApiError),

  create: (
    data: Omit<
      EmailCampaign,
      'id' | 'createdAt' | 'updatedAt' | 'sent_at' | 'recipient_count'
    >
  ) =>
    api
      .post<EmailCampaign>('/email-campaigns', data)
      .then((res) => res.data)
      .catch(handleApiError),

  update: (id: string, data: Partial<EmailCampaign>) =>
    api
      .put<EmailCampaign>(`/email-campaigns/${id}`, data)
      .then((res) => res.data)
      .catch(handleApiError),

  delete: (id: string) =>
    api.delete(`/email-campaigns/${id}`).catch(handleApiError),

  send: (id: string, filters?: CampaignFilter) =>
    api
      .post<{ message: string; campaignId: string }>(
        `/email-campaigns/${id}/send`,
        { filters }
      )
      .then((res) => res.data)
      .catch(handleApiError),

  previewRecipients: (filters?: CampaignFilter) =>
    api
      .post<{ count: number; sample: { name: string; email: string }[] }>(
        '/email-campaigns/preview-recipients',
        { filters }
      )
      .then((res) => res.data)
      .catch(handleApiError),

  getStatus: (id: string) =>
    api
      .get<EmailCampaign>(`/email-campaigns/${id}`)
      .then((res) => res.data)
      .catch(handleApiError),
};
