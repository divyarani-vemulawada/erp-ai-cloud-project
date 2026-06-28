import api from './api';
import type { InventoryItem, PurchaseOrder } from '../types/supplyChain';

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get('/supply-chain/inventory');
  return response.data;
};

export const createInventoryItem = async (
  data: Omit<InventoryItem, 'id'>
): Promise<InventoryItem> => {
  const response = await api.post('/supply-chain/inventory', data);
  return response.data.item;
};

export const updateInventoryItem = async (
  id: string,
  data: Partial<Omit<InventoryItem, 'id'>>
): Promise<InventoryItem> => {
  const response = await api.put(`/supply-chain/inventory/${id}`, data);
  return response.data.item;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  await api.delete(`/supply-chain/inventory/${id}`);
};

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  const response = await api.get('/supply-chain/purchase-orders');
  return response.data;
};

export const createPurchaseOrder = async (
  data: Omit<PurchaseOrder, 'id'>
): Promise<PurchaseOrder> => {
  const response = await api.post('/supply-chain/purchase-orders', data);
  return response.data.order;
};

export const updatePurchaseOrder = async (
  id: string,
  data: Partial<Omit<PurchaseOrder, 'id'>>
): Promise<PurchaseOrder> => {
  const response = await api.put(`/supply-chain/purchase-orders/${id}`, data);
  return response.data.order;
};
