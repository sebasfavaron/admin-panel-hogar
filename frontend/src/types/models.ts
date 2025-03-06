export type HelpType = 'financial' | 'physical' | 'both';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  phone?: string;
  help_type: HelpType;
  last_contact?: Date;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  payment_method: string;
  CollaboratorId: string;
  collaborator?: Collaborator;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  sent_at?: Date;
  status: 'draft' | 'sent';
  recipient_count: number;
  recipients?: Collaborator[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CampaignFilter {
  helpType?: HelpType;
  lastContactBefore?: Date;
  lastContactAfter?: Date;
}
