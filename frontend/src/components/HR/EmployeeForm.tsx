import { useState } from 'react';
import type { Employee } from '../../types/hr';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';

type EmployeeFormProps = {
  onSubmit: (employeeData: Omit<Employee, 'id'>) => Promise<void>;
  onCancel: () => void;
  initialData?: Employee;
};

const emptyForm = {
  employeeId: '',
  fullName: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  joiningDate: '',
  status: 'Active' as const,
};

function EmployeeForm({ onSubmit, onCancel, initialData }: EmployeeFormProps) {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    employeeId: initialData?.employeeId ?? '',
    fullName: initialData?.fullName ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    department: initialData?.department ?? '',
    designation: initialData?.designation ?? '',
    joiningDate: initialData?.joiningDate ?? '',
    status: initialData?.status ?? 'Active',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(formData as Omit<Employee, 'id'>);
      if (!isEditMode) setFormData(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const submitLabel = isLoading
    ? isEditMode ? 'Updating...' : 'Saving...'
    : isEditMode ? 'Update Employee' : 'Save Employee';

  return (
    <div className="employee-form">
      <Card title={isEditMode ? 'Edit Employee' : 'Add Employee'} />

      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <Input
              type="text"
              placeholder="Enter Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <Input
              type="text"
              placeholder="Enter Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <Input
              type="text"
              placeholder="Enter Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Engineering">Engineering</option>
              <option value="Operations">Operations</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <Input
              type="text"
              placeholder="Enter Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="joiningDate">Joining Date</label>
            <Input
              type="date"
              placeholder="Select Joining Date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <Button text="Cancel" onClick={onCancel} type="button" />
          <Button text={submitLabel} disabled={isLoading} type="submit" />
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
