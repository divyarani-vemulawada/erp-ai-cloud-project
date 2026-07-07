import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layout/Mainlayout';
import { toast } from 'sonner';
import LeaveManagement from '../../components/HR/LeaveManagement';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import type { LeaveRequest } from '../../types/hr';
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveStatus,
} from '../../services/hrService';

const emptyForm = {
  employeeId: '',
  leaveType: 'Annual',
  startDate: '',
  endDate: '',
  reason: '',
};

function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadLeaveRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeaveRequests();
      setLeaveRequests(data);
    } catch {
      setError('Failed to load leave requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaveRequests();
  }, [loadLeaveRequests]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormData(emptyForm);
    setFormError(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    try {
      await createLeaveRequest(formData);
      setFormData(emptyForm);
      setShowForm(false);
      await loadLeaveRequests();
      toast.success("Leave request submitted successfully!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit leave request';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateLeaveStatus(id, 'Approved');
      await loadLeaveRequests();
      toast.success("Leave request approved successfully.");
    } catch {
      setError('Failed to approve leave. Please try again.');
      toast.error("Failed to approve leave.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateLeaveStatus(id, 'Rejected');
      await loadLeaveRequests();
      toast.success("Leave request rejected.");
    } catch {
      setError('Failed to reject leave. Please try again.');
      toast.error("Failed to reject leave.");
    }
  };

  return (
    <MainLayout>
      <div className="leave-page">
        <div className="page-header">
          <h1>Leave Management</h1>
          {!showForm && (
            <Button text="Submit Leave" onClick={handleAddClick} type="button" />
          )}
        </div>

        {error && <div className="page-error">{error}</div>}

        {showForm && (
          <div className="form-section">
            <div className="leave-form">
              <Card title="Submit Leave Request" />
              <form onSubmit={handleFormSubmit} className="form-container">
                {formError && <div className="form-error">{formError}</div>}

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
                    <label htmlFor="leaveType">Leave Type</label>
                    <select
                      name="leaveType"
                      value={formData.leaveType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Annual">Annual</option>
                      <option value="Sick">Sick</option>
                      <option value="Personal">Personal</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Paternity">Paternity</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <Input
                      type="date"
                      placeholder="Start Date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <Input
                      type="date"
                      placeholder="End Date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="reason">Reason</label>
                    <Input
                      type="text"
                      placeholder="Enter reason for leave"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <Button text="Cancel" onClick={handleCancel} type="button" />
                  <Button
                    text={formLoading ? 'Submitting...' : 'Submit Request'}
                    disabled={formLoading}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p className="loading-text">Loading leave requests...</p>
        ) : (
          <LeaveManagement
            leaveRequests={leaveRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default LeavePage;
