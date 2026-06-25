import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layout/Mainlayout';
import PayrollDashboard from '../../components/HR/PayrollDashboard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import type { Payroll } from '../../types/hr';
import {
  getPayroll,
  createPayroll,
  updatePayroll,
  deletePayroll,
} from '../../services/hrService';

const emptyForm = {
  employeeId: '',
  basicSalary: '',
  allowances: '',
  deductions: '',
  netSalary: '',
};

function PayrollPage() {
  const [payrollRecords, setPayrollRecords] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'add' | 'edit' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Payroll | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showForm = mode !== null;

  const loadPayroll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPayroll();
      setPayrollRecords(data);
    } catch {
      setError('Failed to load payroll records. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayroll();
  }, [loadPayroll]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setSelectedRecord(null);
    setFormData(emptyForm);
    setFormError(null);
    setMode('add');
  };

  const handleEditClick = (record: Payroll) => {
    setSelectedRecord(record);
    setFormData({
      employeeId: record.employeeId,
      basicSalary: String(record.basicSalary),
      allowances: String(record.allowances),
      deductions: String(record.deductions),
      netSalary: String(record.netSalary),
    });
    setFormError(null);
    setMode('edit');
  };

  const handleCancel = () => {
    setMode(null);
    setSelectedRecord(null);
    setFormError(null);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deletePayroll(id);
      await loadPayroll();
    } catch {
      setError('Failed to delete payroll record. Please try again.');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const salaryFields = {
      basicSalary: Number(formData.basicSalary),
      allowances: Number(formData.allowances),
      deductions: Number(formData.deductions),
      netSalary: Number(formData.netSalary),
    };

    try {
      if (mode === 'edit' && selectedRecord) {
        await updatePayroll(selectedRecord.id, salaryFields);
      } else {
        await createPayroll({ employeeId: formData.employeeId, ...salaryFields });
      }
      await loadPayroll();
      handleCancel();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save payroll record');
    } finally {
      setFormLoading(false);
    }
  };

  const submitLabel = formLoading
    ? mode === 'edit' ? 'Updating...' : 'Saving...'
    : mode === 'edit' ? 'Update Record' : 'Save Record';

  return (
    <MainLayout>
      <div className="payroll-page">
        <div className="page-header">
          <h1>Payroll Management</h1>
          {!showForm && (
            <Button text="Add Payroll" onClick={handleAddClick} type="button" />
          )}
        </div>

        {error && <div className="page-error">{error}</div>}

        {showForm && (
          <div className="form-section">
            <div className="payroll-form">
              <Card title={mode === 'edit' ? 'Edit Payroll Record' : 'Add Payroll Record'} />
              <form onSubmit={handleFormSubmit} className="form-container">
                {formError && <div className="form-error">{formError}</div>}

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="employeeId">Employee ID</label>
                    <Input
                      type="text"
                      placeholder="Enter Employee ID"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      disabled={mode === 'edit'}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="basicSalary">Basic Salary (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter Basic Salary"
                      name="basicSalary"
                      value={formData.basicSalary}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="allowances">Allowances (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter Allowances"
                      name="allowances"
                      value={formData.allowances}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="deductions">Deductions (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter Deductions"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="netSalary">Net Salary (₹)</label>
                    <Input
                      type="number"
                      placeholder="Enter Net Salary"
                      name="netSalary"
                      value={formData.netSalary}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <Button text="Cancel" onClick={handleCancel} type="button" />
                  <Button text={submitLabel} disabled={formLoading} type="submit" />
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p className="loading-text">Loading payroll records...</p>
        ) : (
          <PayrollDashboard
            payrollRecords={payrollRecords}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default PayrollPage;
