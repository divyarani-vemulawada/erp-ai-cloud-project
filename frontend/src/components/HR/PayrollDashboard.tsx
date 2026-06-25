import type { Payroll } from '../../types/hr';
import Card from '../common/Card';
import Button from '../common/Button';

type PayrollDashboardProps = {
  payrollRecords: Payroll[];
  onEdit?: (record: Payroll) => void;
  onDelete?: (id: string) => void;
};

function PayrollDashboard({ payrollRecords, onEdit, onDelete }: PayrollDashboardProps) {
  const hasActions = Boolean(onEdit || onDelete);

  const handleDelete = (record: Payroll) => {
    if (window.confirm(`Delete payroll record for Employee ${record.employeeId}? This action cannot be undone.`)) {
      onDelete?.(record.id);
    }
  };

  return (
    <div className="payroll-dashboard">
      <Card title="Payroll Records" />
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Basic Salary (₹)</th>
            <th>Allowances (₹)</th>
            <th>Deductions (₹)</th>
            <th>Net Salary (₹)</th>
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {payrollRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.employeeId}</td>
              <td>{record.basicSalary.toLocaleString('en-IN')}</td>
              <td>{record.allowances.toLocaleString('en-IN')}</td>
              <td>{record.deductions.toLocaleString('en-IN')}</td>
              <td>{record.netSalary.toLocaleString('en-IN')}</td>
              {hasActions && (
                <td className="table-actions">
                  {onEdit && (
                    <Button
                      text="Edit"
                      onClick={() => onEdit(record)}
                      type="button"
                    />
                  )}
                  {onDelete && (
                    <Button
                      text="Delete"
                      onClick={() => handleDelete(record)}
                      type="button"
                      variant="danger"
                    />
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default PayrollDashboard;
