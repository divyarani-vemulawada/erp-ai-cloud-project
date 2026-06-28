import api from './api';
import type { FinanceTransaction } from '../types/finance';

export const getFinanceTransactions = async (): Promise<FinanceTransaction[]> => {
  const response = await api.get('/finance/transactions');
  return response.data;
};

export const createFinanceTransaction = async (
  data: Omit<FinanceTransaction, 'id'>
): Promise<FinanceTransaction> => {
  const response = await api.post('/finance/transactions', data);
  return response.data.transaction;
};

export const updateFinanceTransaction = async (
  id: string,
  data: Partial<Omit<FinanceTransaction, 'id'>>
): Promise<FinanceTransaction> => {
  const response = await api.put(`/finance/transactions/${id}`, data);
  return response.data.transaction;
};

export const deleteFinanceTransaction = async (id: string): Promise<void> => {
  await api.delete(`/finance/transactions/${id}`);
};
