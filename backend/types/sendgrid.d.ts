declare module '@sendgrid/mail' {
  export interface EmailData {
    to: string | { email: string; name?: string }[];
    from: string | { email: string; name?: string };
    subject: string;
    text?: string;
    html?: string;
    trackingSettings?: {
      clickTracking?: { enable?: boolean };
      openTracking?: { enable?: boolean };
      subscriptionTracking?: { enable?: boolean };
    };
    attachments?: Array<{
      content: string;
      filename: string;
      type?: string;
      disposition?: string;
      contentId?: string;
    }>;
  }

  export function setApiKey(apiKey: string): void;
  export function send(data: EmailData): Promise<[{}, {}]>;
  export function sendMultiple(data: EmailData): Promise<[{}, {}]>;
}
