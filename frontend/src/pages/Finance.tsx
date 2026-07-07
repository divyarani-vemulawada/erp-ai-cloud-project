import { useCallback, useEffect, useMemo, useState } from 'react';
import MainLayout from '../layout/Mainlayout';
import { toast } from 'sonner';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import type { FinanceTransaction } from '../types/finance';
import {
  createFinanceTransaction,
  deleteFinanceTransaction,
  getFinanceTransactions,
} from '../services/financeService';

const emptyForm = {
  reference: '',
  type: 'GL',
  account: '',
  counterparty: '',
  currency: 'INR',
  amount: '',
  status: 'Pending',
  transactionDate: '',
  description: '',
};

function Finance() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setTransactions(await getFinanceTransactions());
    } catch {
      setError('Failed to load finance transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const totals = useMemo(() => {
    const receivables = transactions
      .filter((item) => item.type === 'AR')
      .reduce((sum, item) => sum + item.amount, 0);
    const payables = transactions
      .filter((item) => item.type === 'AP')
      .reduce((sum, item) => sum + item.amount, 0);
    const paid = transactions
      .filter((item) => item.status === 'Paid')
      .reduce((sum, item) => sum + item.amount, 0);
    return { receivables, payables, paid };
  }, [transactions]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createFinanceTransaction({
        ...formData,
        type: formData.type as FinanceTransaction['type'],
        status: formData.status as FinanceTransaction['status'],
        amount: Number(formData.amount),
      });
      setFormData(emptyForm);
      setShowForm(false);
      await loadTransactions();
      toast.success("Transaction recorded successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save transaction.';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFinanceTransaction(id);
      await loadTransactions();
      toast.success("Transaction deleted successfully.");
    } catch {
      setError('Failed to delete transaction.');
      toast.error("Failed to delete transaction.");
    }
  };

  return (
    <MainLayout>
      <div className="module-page">
        <div className="page-header">
          <h1>Finance Management</h1>
          {!showForm && <Button text="Add Transaction" onClick={() => setShowForm(true)} />}
        </div>

        {error && <div className="page-error">{error}</div>}

        <div className="metric-grid">
          <Card title="Receivables"><strong>{totals.receivables.toLocaleString()} INR</strong></Card>
          <Card title="Payables"><strong>{totals.payables.toLocaleString()} INR</strong></Card>
          <Card title="Paid Value"><strong>{totals.paid.toLocaleString()} INR</strong></Card>
        </div>

        {showForm && (
          <div className="form-section module-form">
            <Card title="New Finance Transaction" />
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Reference</label>
                  <Input name="reference" value={formData.reference} onChange={handleChange} placeholder="GL-2026-001" />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-select" name="type" value={formData.type} onChange={handleChange}>
                    <option value="GL">General Ledger</option>
                    <option value="AP">Accounts Payable</option>
                    <option value="AR">Accounts Receivable</option>
                    <option value="Payment">Payment</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Account</label>
                  <Input name="account" value={formData.account} onChange={handleChange} placeholder="Cash / Revenue / Expense" />
                </div>
                <div className="form-group">
                  <label>Counterparty</label>
                  <Input name="counterparty" value={formData.counterparty} onChange={handleChange} placeholder="Vendor or customer" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <Input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="50000" />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <Input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleChange} placeholder="Date" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <Button text="Cancel" onClick={() => setShowForm(false)} />
                <Button text="Save Transaction" type="submit" />
              </div>
            </form>
          </div>
        )}

        <div className="module-table">
          <Card title="Ledger, AP and AR Transactions" />
          {loading ? <p className="loading-text">Loading finance data...</p> : (
            <>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Reference</th><th>Type</th><th>Account</th><th>Counterparty</th><th>Amount</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((item) => (
                      <tr key={item.id}>
                        <td>{item.reference}</td><td>{item.type}</td><td>{item.account}</td><td>{item.counterparty}</td>
                        <td>{item.amount.toLocaleString()} {item.currency}</td><td><span className={`status-pill status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>{item.status}</span></td>
                        <td><Button text="Delete" variant="danger" onClick={() => handleDelete(item.id)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {Math.ceil(transactions.length / rowsPerPage) > 1 && (
                <div className="pagination-wrapper">
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      type="button"
                    >
                      &lt;
                    </button>
                    {Array.from({ length: Math.ceil(transactions.length / rowsPerPage) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                        type="button"
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      disabled={currentPage === Math.ceil(transactions.length / rowsPerPage)}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(transactions.length / rowsPerPage)))}
                      type="button"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Finance;
