import { useState } from 'react';
import MainLayout from '../../layout/Mainlayout';
import EmployeeList from '../../components/HR/EmployeeList';
import EmployeeForm from '../../components/HR/EmployeeForm';
import OrganisationChart from '../../components/HR/OrganisationChart';
import Button from '../../components/common/Button';
import type { Employee } from '../../types/hr';
import { employees as mockEmployees } from '../../services/mock/hrMockData';

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showForm, setShowForm] = useState(false);

  const handleAddEmployeeClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...employeeData,
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setShowForm(false);
  };

  return (
    <MainLayout>
      <div className="employees-page">
        <div className="page-header">
          <h1>Human Resources</h1>
          {!showForm && (
            <Button
              text="Add Employee"
              onClick={handleAddEmployeeClick}
              type="button"
            />
          )}
        </div>

        {showForm && (
          <div className="form-section">
            <EmployeeForm onSubmit={handleFormSubmit} onCancel={handleCancel} />
          </div>
        )}

        <EmployeeList employees={employees} />

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
