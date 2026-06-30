import { useState } from 'react';
import type { Attendance } from '../../types/hr';
import Card from '../common/Card';
import Button from '../common/Button';

type AttendanceTrackerProps = {
  attendanceRecords: Attendance[];
  onCheckIn?: (id: string) => void;
  onCheckOut?: (id: string) => void;
  onStatusChange?: (id: string, status: 'Present' | 'Absent') => void;
};

function AttendanceTracker({ attendanceRecords, onCheckIn, onCheckOut, onStatusChange }: AttendanceTrackerProps) {
  const hasActions = Boolean(onCheckIn || onCheckOut || onStatusChange);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="attendance-tracker">
      <Card title="Attendance Records" />
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Status</th>
            {hasActions && <th className="table-actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.employeeId}</td>
              <td>{record.date}</td>
              <td>{record.checkIn || '—'}</td>
              <td>{record.checkOut || '—'}</td>
              <td>
                {editingId === record.id ? (
                  <select
                    className="form-select"
                    value={record.status}
                    onChange={(e) => {
                      onStatusChange?.(record.id, e.target.value as 'Present' | 'Absent');
                      setEditingId(null);
                    }}
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                ) : (
                  <span
                    style={{
                      background: record.status === "Present" ? "#dcfce7" : "#fee2e2",
                      color: record.status === "Present" ? "#16a34a" : "#dc2626",
                      padding: "3px 12px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600
                    }}
                  >
                    {record.status}
                  </span>
                )}
              </td>
              {hasActions && (
                <td className="table-actions">
                  <div className="action-buttons">
                    {!record.checkIn && onCheckIn && (
                      <Button
                        text="Check In"
                        onClick={() => onCheckIn(record.id)}
                        type="button"
                      />
                    )}
                    {record.checkIn && !record.checkOut && onCheckOut && (
                      <Button
                        text="Check Out"
                        onClick={() => onCheckOut(record.id)}
                        type="button"
                      />
                    )}
                    {onStatusChange && (
                      <Button
                        text="Edit"
                        onClick={() => setEditingId(record.id)}
                        type="button"
                      />
                    )}
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

export default AttendanceTracker;