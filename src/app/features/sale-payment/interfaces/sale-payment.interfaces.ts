import { SaleInvoice } from '@features/sale-invoice/interfaces/sale-invoice.interfaces';
import { User } from '@features/user/interfaces/user';

export interface SalePayment {
  id: string;
  sale_invoice_id: string;
  customer_id: string;
  user: User;
  date: Date;
  payment_method: number;
  payment_method_label: string;
  total: number;
  midtrans_payment_id: string;
  file_path: string;
  url: string;
  status: number;
  status_label: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  sale_payment_documents: any[];
  midtrans_payment: MidtransPayment;
  payment_response: any;
  sale_invoice: SaleInvoice;
}

export interface MidtransPayment {
  id: number;
  sale_payment_id: number;
  status: number;
  payload: JSON;
  snap_response: {
    token: string;
    redirect_url: string;
  };
  created_at: string;
  updated_at: string;
}

export enum SalePaymentStatusEnum {
  PENDING = 0,
  PAID = 1,
  CANCELLED = 2,
}

export const getSalePaymentStatusEnumLabel = (
  saleInvoiceStatusEnum: number
) => {
  switch (saleInvoiceStatusEnum) {
    case SalePaymentStatusEnum.PENDING:
      return 'Pending';
    case SalePaymentStatusEnum.PAID:
      return 'Paid';
    case SalePaymentStatusEnum.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};
