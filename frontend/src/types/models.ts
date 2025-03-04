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
  phone: string;
  help_type: HelpType;
  last_contact: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  amount: number;
  currency: string;
  date: string;
  payment_method: string;
  CollaboratorId: string;
  collaborator?: Collaborator;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  subject: string;
  body: string;
  sent_at?: string;
  status: 'draft' | 'sent';
  recipient_count: number;
  recipients?: Collaborator[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignFilter {
  helpType?: HelpType;
  lastContactBefore?: Date;
  lastContactAfter?: Date;
}
