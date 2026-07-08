import { useState, useEffect, useCallback, useContext } from 'react';
import MainLayout from '../../layout/Mainlayout';
import { toast } from 'sonner';
import EmployeeList from '../../components/HR/EmployeeList';
import EmployeeForm from '../../components/HR/EmployeeForm';
import OrganisationChart from '../../components/HR/OrganisationChart';
import Button from '../../components/common/Button';
import type { Employee, OrgDepartment } from '../../types/hr';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getOrganisationChart,
} from '../../services/hrService';
import { AuthContext } from '../../context/AuthContext';

function Employees() {
  const auth = useContext(AuthContext);
  const role = auth?.user?.role || '';
  const canAddEdit = ['admin', 'hr_manager'].includes(role);
  const canDelete = role === 'admin';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orgDepartments, setOrgDepartments] = useState<OrgDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'add' | 'edit' | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const showForm = mode !== null;

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [data, org] = await Promise.all([getEmployees(), getOrganisationChart()]);
      setEmployees(data);
      setOrgDepartments(org);
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
      toast.success("Employee deleted successfully.");
    } catch {
      setError('Failed to delete employee. Please try again.');
      toast.error("Failed to delete employee.");
    }
  };

  const handleCancel = () => {
    setMode(null);
    setSelectedEmployee(null);
  };

  // Errors thrown here propagate into EmployeeForm's own catch block and
  // are displayed inline in the form — no extra error handling needed here.
  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      if (mode === 'edit' && selectedEmployee) {
        await updateEmployee(selectedEmployee.id, employeeData);
        toast.success("Employee details updated successfully!");
      } else {
        await createEmployee(employeeData);
        toast.success("New employee added successfully!");
      }
      await loadEmployees();
      handleCancel();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save employee details.");
      throw err;
    }
  };

  return (
    <MainLayout>
      <div className="employees-page">
        <div className="page-header">
          <h1>Human Resources</h1>
          {canAddEdit && !showForm && (
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
              canEdit={canAddEdit}
              canDelete={canDelete}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            <div className="org-chart-section">
              <div className="page-header">
                <h2>Organisation Chart</h2>
              </div>
              <OrganisationChart departments={orgDepartments} />
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Employees;
