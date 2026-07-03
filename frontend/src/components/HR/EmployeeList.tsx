import { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleDelete = (employee: Employee) => {
    if (window.confirm(`Delete ${employee.fullName}? This action cannot be undone.`)) {
      onDelete?.(employee.id);
    }
  };

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const displayedEmployees = employees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
            {displayedEmployees.map((employee) => (
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
                  <span className={`status-pill status-${employee.status.toLowerCase().replace(/\s+/g, '-')}`}>
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
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;