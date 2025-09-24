import { Project } from '@features/project/interfaces/project.interfaces';
import { SalePayment } from '@features/sale-payment/interfaces/sale-payment.interfaces';
import { User } from '@features/user/interfaces/user';

export interface SaleInvoice {
  id: string;
  invoice_no: string;
  customer_id: string;
  customer: User;
  subtotal: number;
  paid_amount: number;
  remaining_amount: number;
  status: number;
  status_label: string;
  date: Date;
  discount_type: number;
  discount_type_label: string;
  discount_value: number;
  discount_amount: number;
  project: Project;
  sale_payments: SalePayment[];
  created_at: string;
  updated_at: string;
  deleted_at: any;
}

export enum SaleInvoiceStatusEnum {
  PENDING = 0,
  PARTIALLY_PAID = 1,
  PAID = 2,
  CANCELLED = 3,
}

export const getSaleInvoiceStatusEnumLabel = (
  saleInvoiceStatusEnum: number
) => {
  switch (saleInvoiceStatusEnum) {
    case SaleInvoiceStatusEnum.PENDING:
      return 'Pending';
    case SaleInvoiceStatusEnum.PARTIALLY_PAID:
      return 'Partially Paid';
    case SaleInvoiceStatusEnum.PAID:
      return 'Paid';
    case SaleInvoiceStatusEnum.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};
