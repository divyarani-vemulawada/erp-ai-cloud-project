import { useState, useEffect, useCallback } from 'react';
import MainLayout from '../../layout/Mainlayout';
import AttendanceTracker from '../../components/HR/AttendanceTracker';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import type { Attendance } from '../../types/hr';
import {
  getAttendance,
  createAttendance,
  updateAttendance,
} from '../../services/hrService';

const emptyForm = {
  employeeId: '',
  date: '',
  checkIn: '',
  checkOut: '',
  status: 'Absent',
};

function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAttendance();
      setAttendanceRecords(data);
    } catch {
      setError('Failed to load attendance records. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

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
      await createAttendance({
        ...formData,
        status: formData.status as Attendance['status'],
      });
      setFormData(emptyForm);
      setShowForm(false);
      await loadAttendance();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save record');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      const checkIn = new Date().toTimeString().slice(0, 5);
      await updateAttendance(id, { checkIn, status: 'Present' });
      await loadAttendance();
    } catch {
      setError('Failed to record check-in. Please try again.');
    }
  };

  const handleCheckOut = async (id: string) => {
    try {
      const checkOut = new Date().toTimeString().slice(0, 5);
      await updateAttendance(id, { checkOut });
      await loadAttendance();
    } catch {
      setError('Failed to record check-out. Please try again.');
    }
  };

  return (
    <MainLayout>
      <div className="attendance-page">
        <div className="page-header">
          <h1>Attendance Management</h1>
          {!showForm && (
            <Button text="Add Record" onClick={handleAddClick} type="button" />
          )}
        </div>

        {error && <div className="page-error">{error}</div>}

        {showForm && (
          <div className="form-section">
            <div className="attendance-form">
              <Card title="New Attendance Record" />
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
                    <label htmlFor="date">Date</label>
                    <Input
                      type="date"
                      placeholder="Select Date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkIn">Check In</label>
                    <Input
                      type="time"
                      placeholder="Check In Time"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkOut">Check Out</label>
                    <Input
                      type="time"
                      placeholder="Check Out Time"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <Button text="Cancel" onClick={handleCancel} type="button" />
                  <Button
                    text={formLoading ? 'Saving...' : 'Save Record'}
                    disabled={formLoading}
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <p className="loading-text">Loading attendance records...</p>
        ) : (
          <AttendanceTracker
            attendanceRecords={attendanceRecords}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default AttendancePage;
