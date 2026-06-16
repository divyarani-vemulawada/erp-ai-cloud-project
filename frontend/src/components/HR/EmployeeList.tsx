import type { Employee } from '../../types/hr';
import Table from '../common/Table';
import Card from '../common/Card';

type EmployeeListProps = {
  employees: Employee[];
};

function EmployeeList({ employees }: EmployeeListProps) {
  // Transform employee data to table format
  const tableHeaders = [
    'Employee ID',
    'Full Name',
    'Email',
    'Department',
    'Designation',
    'Status',
  ];

  const tableData = employees.map((employee) => [
    employee.employeeId,
    employee.fullName,
    employee.email,
    employee.department,
    employee.designation,
    employee.status,
  ]);

  return (
    <div className="employee-list">
      <Card title="Employee Directory" />
      <Table headers={tableHeaders} data={tableData} />
    </div>
  );
}

export default EmployeeList;
