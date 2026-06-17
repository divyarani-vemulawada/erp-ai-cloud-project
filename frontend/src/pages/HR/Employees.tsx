import { useState } from 'react';
import MainLayout from '../../layout/Mainlayout';
import EmployeeList from '../../components/HR/EmployeeList';
import EmployeeForm from '../../components/HR/EmployeeForm';
import OrganisationChart from '../../components/HR/OrganisationChart';
import Button from '../../components/common/Button';
import type { Employee } from '../../types/hr';
import { employees as mockEmployees } from '../../services/mock/hrMockData';

const currentUserRole = 'admin';

function Employees() {
  const isAdmin = currentUserRole === 'admin';

  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [mode, setMode] = useState<'add' | 'edit' | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const showForm = mode !== null;

  const handleAddClick = () => {
    setSelectedEmployee(null);
    setMode('add');
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setMode('edit');
  };

  const handleDeleteClick = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const handleCancel = () => {
    setMode(null);
    setSelectedEmployee(null);
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    if (mode === 'edit' && selectedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...employeeData } : emp
        )
      );
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...employeeData,
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
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

        {showForm && (
          <div className="form-section">
            <EmployeeForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              initialData={selectedEmployee ?? undefined}
            />
          </div>
        )}

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
      </div>
    </MainLayout>
  );
}

export default Employees;
