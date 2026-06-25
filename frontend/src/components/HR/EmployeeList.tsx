import type { Employee } from '../../types/hr';
import Card from '../common/Card';
import Button from '../common/Button';

type EmployeeListProps = {
  employees: Employee[];
  isAdmin?: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
};

function EmployeeList({ employees, isAdmin = false, onEdit, onDelete }: EmployeeListProps) {
  const handleDelete = (employee: Employee) => {
    if (window.confirm(`Delete ${employee.fullName}? This action cannot be undone.`)) {
      onDelete?.(employee.id);
    }
  };

  return (
    <div className="employee-list">
      <Card title="Employee Directory" />
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employeeId}</td>
              <td>{employee.fullName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.designation}</td>
              <td>{employee.status}</td>
              {isAdmin && (
                <td className="table-actions">
                  <Button
                    text="Edit"
                    onClick={() => onEdit?.(employee)}
                    type="button"
                  />
                  <Button
                    text="Delete"
                    onClick={() => handleDelete(employee)}
                    type="button"
                    variant="danger"
                  />
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

export default EmployeeList;
