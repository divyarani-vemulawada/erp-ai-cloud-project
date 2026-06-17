import type { Payroll } from '../../types/hr';
import Table from '../common/Table';
import Card from '../common/Card';

type PayrollDashboardProps = {
  payrollRecords: Payroll[];
};

function PayrollDashboard({ payrollRecords }: PayrollDashboardProps) {
  const tableHeaders = [
    'Employee ID',
    'Basic Salary (₹)',
    'Allowances (₹)',
    'Deductions (₹)',
    'Net Salary (₹)',
  ];

  const tableData = payrollRecords.map((record) => [
    record.employeeId,
    record.basicSalary.toLocaleString('en-IN'),
    record.allowances.toLocaleString('en-IN'),
    record.deductions.toLocaleString('en-IN'),
    record.netSalary.toLocaleString('en-IN'),
  ]);

  return (
    <div className="payroll-dashboard">
      <Card title="Payroll Records" />
      <Table headers={tableHeaders} data={tableData} />
    </div>
  );
}

export default PayrollDashboard;
