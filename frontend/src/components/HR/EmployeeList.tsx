import type { Employee } from '../../types/hr';
import Card from '../common/Card';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

type EmployeeListProps = {
  employees: Employee[];
  isAdmin?: boolean;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
};

function EmployeeList({ employees, isAdmin = false, onEdit, onDelete }: EmployeeListProps) {
  const navigate = useNavigate();

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
              {isAdmin && <th className="table-actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.employeeId}</td>
                <td>
                  <span
                    style={{
                      color: "#2563eb",
                      cursor: "pointer",
                      textDecoration: "underline"
                    }}
                    onClick={() => navigate(`/employees/${employee.employeeId}`)}
                  >
                    {employee.fullName}
                  </span>
                </td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.designation}</td>
                <td>
                  <span style={{
                    background: employee.status === "Active" ? "#dcfce7" : "#fee2e2",
                    color: employee.status === "Active" ? "#16a34a" : "#dc2626",
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}>
                    {employee.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="table-actions">
                    <div className="action-buttons">
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
                    </div>
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