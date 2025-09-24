import { Feature } from '@features/feature/interfaces/feature.interfaces';

export interface Project {
  id: string;
  name: string;
  description: string;
  assigned_to: string;
  customer_id: string;
  price_total: number;
  paid_amount: number;
  remaining_amount: number;
  is_template: boolean;
  features: Feature[];
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export interface Attachment {
  id: string;
  file: string;
  feature_id: string;
  note: string;
}
