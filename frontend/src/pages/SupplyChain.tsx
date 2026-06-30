import { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layout/Mainlayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import type { InventoryItem } from '../types/supplyChain';
import {
  createInventoryItem,
  getInventoryItems,
  getPurchaseOrders,
} from '../services/supplyChainService';

const emptyItem = {
  sku: '',
  name: '',
  category: '',
  warehouse: '',
  stock: '',
  reorderLevel: '',
  unitCost: '',
  vendor: '',
  status: 'In Stock',
};

function SupplyChain() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [openOrders, setOpenOrders] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyItem);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupplyChain = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [inventory, orders] = await Promise.all([getInventoryItems(), getPurchaseOrders()]);
      setItems(inventory);
      setOpenOrders(orders.filter((order) => order.status === 'Draft' || order.status === 'Sent').length);
    } catch {
      setError('Failed to load supply chain data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupplyChain();
  }, [loadSupplyChain]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;

    if (["stock", "reorderLevel", "unitCost"].includes(name)) {
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: value }));
        return;
      }
      const num = Number(value);
      if (num < 0 || num > 1000) return; // block invalid values
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createInventoryItem({
        ...formData,
        status: formData.status as InventoryItem['status'],
        stock: Number(formData.stock),
        reorderLevel: Number(formData.reorderLevel),
        unitCost: Number(formData.unitCost),
      });
      setFormData(emptyItem);
      setShowForm(false);
      await loadSupplyChain();
    } catch {
      setError('Failed to save inventory item.');
    }
  };

  const lowStock = items.filter((item) => item.status !== 'In Stock' || item.stock <= item.reorderLevel).length;
  const stockValue = items.reduce((sum, item) => sum + item.stock * item.unitCost, 0);

  return (
    <MainLayout>
      <div className="module-page">
        <div className="page-header">
          <h1>Supply Chain & Inventory</h1>
          {!showForm && <Button text="Add Item" onClick={() => setShowForm(true)} />}
        </div>
        {error && <div className="page-error">{error}</div>}

        <div className="metric-grid">
          <Card title="Inventory Items"><strong>{items.length}</strong></Card>
          <Card title="Low Stock"><strong>{lowStock}</strong></Card>
          <Card title="Open Purchase Orders"><strong>{openOrders}</strong></Card>
          <Card title="Stock Value"><strong>{stockValue.toLocaleString()} INR</strong></Card>
        </div>

        {showForm && (
          <div className="form-section module-form">
            <Card title="New Inventory Item" />
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>SKU</label><Input name="sku" value={formData.sku} onChange={handleChange} placeholder="SKU-001" /></div>
                <div className="form-group"><label>Name</label><Input name="name" value={formData.name} onChange={handleChange} placeholder="Item name" /></div>
                <div className="form-group"><label>Category</label><Input name="category" value={formData.category} onChange={handleChange} placeholder="Raw Material" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Warehouse</label><Input name="warehouse" value={formData.warehouse} onChange={handleChange} placeholder="HYD-01" /></div>
                <div className="form-group"><label>Vendor</label><Input name="vendor" value={formData.vendor} onChange={handleChange} placeholder="Vendor name" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Stock</label><Input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="100" min={0} max={1000} /></div>
                <div className="form-group"><label>Reorder Level</label><Input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} placeholder="25" min={0} max={1000} /></div>
                <div className="form-group"><label>Unit Cost</label><Input type="number" name="unitCost" value={formData.unitCost} onChange={handleChange} placeholder="500" min={0} max={1000} /></div>
              </div>
              <div className="form-actions">
                <Button text="Cancel" onClick={() => setShowForm(false)} />
                <Button text="Save Item" type="submit" />
              </div>
            </form>
          </div>
        )}

        <div className="module-table">
          <Card title="Inventory Control" />
          {loading ? <p className="loading-text">Loading inventory...</p> : (
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>SKU</th><th>Name</th><th>Warehouse</th><th>Stock</th><th>Reorder</th><th>Vendor</th><th>Status</th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.sku}</td><td>{item.name}</td><td>{item.warehouse}</td><td>{item.stock}</td><td>{item.reorderLevel}</td><td>{item.vendor}</td>
                      <td><span className="status-pill">{item.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default SupplyChain;