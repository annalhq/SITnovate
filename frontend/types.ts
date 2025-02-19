export interface EmailHeader {
  from: string;
  subject: string;
  protocol: string;
  dmarc: {
    status: string;
    domain: string;
    policy: string;
  };
  metadata: {
    received: string;
    spf: string;
    dkim: string;
    message_id: string;
  };
}

export interface EmailData {
  headers: Record<string, EmailHeader>;
  links: Record<string, string[]>;
  texts: Record<string, string>;
}
