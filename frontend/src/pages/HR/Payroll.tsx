import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layout/Mainlayout';
import { toast } from 'sonner';
import PayrollDashboard from '../../components/HR/PayrollDashboard';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import type { Payroll, Payslip } from '../../types/hr';
import {
  getPayroll,
  createPayroll,
  updatePayroll,
  deletePayroll,
  getPayslips,
  createPayslip,
  deletePayslip,
} from '../../services/hrService';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const currentMonth = MONTHS[new Date().getMonth()];
const currentYear  = String(new Date().getFullYear());

const emptyForm = {
  employeeId: '',
  basicSalary: '',
  allowances: '',
  deductions: '',
  netSalary: '',
};

function PayrollPage() {
  // ── Payroll state ─────────────────────────────────────────────────────────
  const [payrollRecords, setPayrollRecords] = useState<Payroll[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [mode, setMode]           = useState<'add' | 'edit' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Payroll | null>(null);
  const [formData, setFormData]   = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Payslip state ─────────────────────────────────────────────────────────
  const [payslips, setPayslips]           = useState<Payslip[]>([]);
  const [payslipsLoading, setPayslipsLoading] = useState(true);
  const [payslipTarget, setPayslipTarget] = useState<Payroll | null>(null);
  const [slipMonth, setSlipMonth]         = useState(currentMonth);
  const [slipYear, setSlipYear]           = useState(currentYear);
  const [slipLoading, setSlipLoading]     = useState(false);
  const [slipError, setSlipError]         = useState<string | null>(null);
  const [slipSuccess, setSlipSuccess]     = useState<string | null>(null);

  const showForm = mode !== null;

  // ── Loaders ───────────────────────────────────────────────────────────────
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

  const loadPayslips = useCallback(async () => {
    try {
      setPayslipsLoading(true);
      const data = await getPayslips();
      setPayslips(data);
    } catch {
      // non-blocking — payslips are supplementary
    } finally {
      setPayslipsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayroll();
    loadPayslips();
  }, [loadPayroll, loadPayslips]);

  // ── Payroll handlers ──────────────────────────────────────────────────────
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
      allowances:  String(record.allowances),
      deductions:  String(record.deductions),
      netSalary:   String(record.netSalary),
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
      toast.success("Payroll record deleted successfully.");
    } catch {
      setError('Failed to delete payroll record. Please try again.');
      toast.error("Failed to delete payroll record.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const salaryFields = {
      basicSalary: Number(formData.basicSalary),
      allowances:  Number(formData.allowances),
      deductions:  Number(formData.deductions),
      netSalary:   Number(formData.netSalary),
    };

    try {
      if (mode === 'edit' && selectedRecord) {
        await updatePayroll(selectedRecord.id, salaryFields);
        toast.success("Payroll record updated successfully!");
      } else {
        await createPayroll({ employeeId: formData.employeeId, ...salaryFields });
        toast.success("Payroll record created successfully!");
      }
      await loadPayroll();
      handleCancel();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save payroll record';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  // ── Payslip handlers ──────────────────────────────────────────────────────
  const handleGeneratePayslip = (record: Payroll) => {
    setPayslipTarget(record);
    setSlipMonth(currentMonth);
    setSlipYear(currentYear);
    setSlipError(null);
    setSlipSuccess(null);
  };

  const handleCancelSlip = () => {
    setPayslipTarget(null);
    setSlipError(null);
    setSlipSuccess(null);
  };

  const handleDeleteSlip = async (id: string) => {
    try {
      await deletePayslip(id);
      await loadPayslips();
      toast.success("Payslip deleted successfully.");
    } catch {
      setSlipError('Failed to delete payslip. Please try again.');
      toast.error("Failed to delete payslip.");
    }
  };

  const handleSlipSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payslipTarget) return;
    setSlipLoading(true);
    setSlipError(null);
    setSlipSuccess(null);

    try {
      await createPayslip({
        employeeId:  payslipTarget.employeeId,
        payrollId:   payslipTarget.id,
        month:       slipMonth,
        year:        Number(slipYear),
        basicSalary: payslipTarget.basicSalary,
        allowances:  payslipTarget.allowances,
        deductions:  payslipTarget.deductions,
        netSalary:   payslipTarget.netSalary,
      });
      const successMsg = `Payslip for ${payslipTarget.employeeId} — ${slipMonth} ${slipYear} generated successfully.`;
      setSlipSuccess(successMsg);
      toast.success(successMsg);
      setPayslipTarget(null);
      await loadPayslips();
    } catch (err: any) {
      const errMsg = err?.response?.data?.message ?? (err instanceof Error ? err.message : 'Failed to generate payslip');
      setSlipError(errMsg);
      toast.error(errMsg);
    } finally {
      setSlipLoading(false);
    }
  };

  const submitLabel = formLoading
    ? mode === 'edit' ? 'Updating...' : 'Saving...'
    : mode === 'edit' ? 'Update Record' : 'Save Record';

  // ── Status badge helper ───────────────────────────────────────────────────
  const slipStatusStyle = (status: Payslip['status']) => {
    const map: Record<string, { background: string; color: string }> = {
      Issued:    { background: '#dcfce7', color: '#16a34a' },
      Draft:     { background: '#fef9c3', color: '#854d0e' },
      Cancelled: { background: '#fee2e2', color: '#dc2626' },
    };
    return map[status] ?? { background: '#f1f5f9', color: '#475569' };
  };

  return (
    <MainLayout>
      <div className="payroll-page">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="page-header">
          <h1>Payroll Management</h1>
          {!showForm && (
            <Button text="Add Payroll" onClick={handleAddClick} type="button" />
          )}
        </div>

        {error && <div className="page-error">{error}</div>}

        {/* ── Add / Edit payroll form ───────────────────────────────────── */}
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

        {/* ── Generate Payslip inline form ─────────────────────────────── */}
        {payslipTarget && (
          <div className="form-section">
            <div className="payroll-form">
              <Card title={`Generate Payslip — Employee ${payslipTarget.employeeId}`} />
              <form onSubmit={handleSlipSubmit} className="form-container">
                {slipError && <div className="form-error">{slipError}</div>}
                <p style={{ margin: '0 0 16px', color: '#475569', fontSize: '14px' }}>
                  Net salary: <strong>₹{payslipTarget.netSalary.toLocaleString('en-IN')}</strong>
                </p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="slipMonth">Month</label>
                    <select
                      id="slipMonth"
                      value={slipMonth}
                      onChange={(e) => setSlipMonth(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: '#1e293b',
                        background: 'white',
                      }}
                      required
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="slipYear">Year</label>
                    <Input
                      type="number"
                      placeholder="e.g. 2026"
                      name="slipYear"
                      value={slipYear}
                      onChange={(e) => setSlipYear(e.currentTarget.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <Button text="Cancel" onClick={handleCancelSlip} type="button" />
                  <Button
                    text={slipLoading ? 'Generating...' : 'Generate Payslip'}
                    disabled={slipLoading}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {slipSuccess && (
          <div style={{
            margin: '0 0 20px',
            padding: '12px 16px',
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '8px',
            color: '#166534',
            fontWeight: 600,
            fontSize: '14px',
          }}>
            {slipSuccess}
          </div>
        )}

        {/* ── Payroll records table ─────────────────────────────────────── */}
        {loading ? (
          <p className="loading-text">Loading payroll records...</p>
        ) : (
          <PayrollDashboard
            payrollRecords={payrollRecords}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onGeneratePayslip={handleGeneratePayslip}
          />
        )}

        {/* ── Payslips table ───────────────────────────────────────────── */}
        <div className="payroll-dashboard" style={{ marginTop: '32px' }}>
          <Card title="Generated Payslips" />
          <div className="table-wrapper">
            {payslipsLoading ? (
              <p className="loading-text" style={{ padding: '20px 16px' }}>
                Loading payslips...
              </p>
            ) : payslips.length === 0 ? (
              <p style={{ padding: '20px 16px', color: '#64748b', fontSize: '14px' }}>
                No payslips generated yet. Click <strong>Payslip</strong> on any payroll record above to generate one.
              </p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Basic (₹)</th>
                    <th>Allowances (₹)</th>
                    <th>Deductions (₹)</th>
                    <th>Net Salary (₹)</th>
                    <th>Status</th>
                    <th>Generated At</th>
                    <th className="table-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payslips.map((slip) => (
                    <tr key={slip.id}>
                      <td>{slip.employeeId}</td>
                      <td>{slip.month}</td>
                      <td>{slip.year}</td>
                      <td>{slip.basicSalary.toLocaleString('en-IN')}</td>
                      <td>{slip.allowances.toLocaleString('en-IN')}</td>
                      <td>{slip.deductions.toLocaleString('en-IN')}</td>
                      <td>{slip.netSalary.toLocaleString('en-IN')}</td>
                      <td>
                        <span style={{
                          ...slipStatusStyle(slip.status),
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}>
                          {slip.status}
                        </span>
                      </td>
                      <td>
                        {new Date(slip.generatedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="table-actions">
                        <div className="action-buttons">
                          <Button
                            text="Delete"
                            type="button"
                            onClick={() => handleDeleteSlip(slip.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default PayrollPage;
