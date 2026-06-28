export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';
export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'Received' | 'Cancelled';

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  stock: number;
  reorderLevel: number;
  unitCost: number;
  vendor: string;
  status: InventoryStatus;
};

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  vendor: string;
  item: string;
  quantity: number;
  expectedDate: string;
  amount: number;
  status: PurchaseOrderStatus;
};
