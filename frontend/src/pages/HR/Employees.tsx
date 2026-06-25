import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layout/Mainlayout';
import EmployeeList from '../../components/HR/EmployeeList';
import EmployeeForm from '../../components/HR/EmployeeForm';
import OrganisationChart from '../../components/HR/OrganisationChart';
import Button from '../../components/common/Button';
import type { Employee } from '../../types/hr';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../../services/hrService';

const currentUserRole = 'admin';

function Employees() {
  const isAdmin = currentUserRole === 'admin';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'add' | 'edit' | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const showForm = mode !== null;

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setMode('add');
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setMode('edit');
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteEmployee(id);
      await loadEmployees();
    } catch {
      setError('Failed to delete employee. Please try again.');
    }
  };

  const handleCancel = () => {
    setMode(null);
    setSelectedEmployee(null);
  };

  // Errors thrown here propagate into EmployeeForm's own catch block and
  // are displayed inline in the form — no extra error handling needed here.
  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    if (mode === 'edit' && selectedEmployee) {
      await updateEmployee(selectedEmployee.id, employeeData);
    } else {
      await createEmployee(employeeData);
    }
    await loadEmployees();
    handleCancel();
  };

  return (
    <MainLayout>
      <div className="employees-page">
        <div className="page-header">
          <h1>Human Resources</h1>
          {isAdmin && !showForm && (
            <Button text="Add Employee" onClick={handleAddClick} type="button" />
          )}
        </div>

        {error && <div className="page-error">{error}</div>}

        {showForm && (
          <div className="form-section">
            <EmployeeForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              initialData={selectedEmployee ?? undefined}
            />
          </div>
        )}

        {loading ? (
          <p className="loading-text">Loading employees...</p>
        ) : (
          <>
            <EmployeeList
              employees={employees}
              isAdmin={isAdmin}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            <div className="org-chart-section">
              <div className="page-header">
                <h2>Organisation Chart</h2>
              </div>
              <OrganisationChart employees={employees} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Employees;
