import { useState } from 'react';
import MainLayout from '../../layout/Mainlayout';
import EmployeeList from '../../components/HR/EmployeeList';
import EmployeeForm from '../../components/HR/EmployeeForm';
import Button from '../../components/common/Button';
import type { Employee } from '../../types/hr';
import { employees as mockEmployees } from '../../services/mock/hrMockData';

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [showForm, setShowForm] = useState(false);

  const handleAddEmployeeClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (employeeData: Omit<Employee, 'id'>) => {
    // Create new employee with generated id
    const newEmployee: Employee = {
      id: Date.now().toString(),
      ...employeeData,
    };

    // Add to employees state
    setEmployees((prev) => [...prev, newEmployee]);

    // Hide form after successful submit
    setShowForm(false);
  };

  return (
    <MainLayout>
      <div className="employees-page">
        <div className="page-header">
          <h1>Human Resources</h1>
          <Button
            text="Add Employee"
            onClick={handleAddEmployeeClick}
            type="button"
          />
        </div>

        {showForm && (
          <div className="form-section">
            <EmployeeForm onSubmit={handleFormSubmit} />
          </div>
        )}

        <EmployeeList employees={employees} />
      </div>
    </MainLayout>
  );
}

export default Employees;
