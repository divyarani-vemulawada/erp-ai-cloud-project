export type FinanceTransactionType = 'GL' | 'AP' | 'AR' | 'Payment';
export type FinanceStatus = 'Draft' | 'Pending' | 'Approved' | 'Paid';

export type FinanceTransaction = {
  id: string;
  reference: string;
  type: FinanceTransactionType;
  account: string;
  counterparty: string;
  currency: string;
  amount: number;
  status: FinanceStatus;
  transactionDate: string;
  description?: string;
};
