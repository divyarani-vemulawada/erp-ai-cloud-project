import type { Attendance } from '../../types/hr';
import Card from '../common/Card';
import Button from '../common/Button';

type AttendanceTrackerProps = {
  attendanceRecords: Attendance[];
  onCheckIn?: (id: string) => void;
  onCheckOut?: (id: string) => void;
};

function AttendanceTracker({ attendanceRecords, onCheckIn, onCheckOut }: AttendanceTrackerProps) {
  const hasActions = Boolean(onCheckIn || onCheckOut);

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
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {attendanceRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.employeeId}</td>
              <td>{record.date}</td>
              <td>{record.checkIn || '—'}</td>
              <td>{record.checkOut || '—'}</td>
              <td>{record.status}</td>
              {hasActions && (
                <td className="table-actions">
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
