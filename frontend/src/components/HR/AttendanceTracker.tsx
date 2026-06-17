// src/components/HR/AttendanceTracker.tsx

import type { Attendance } from '../../types/hr';
import Table from '../common/Table';
import Card from '../common/Card';

type AttendanceTrackerProps = {
  attendanceRecords: Attendance[];
};

function AttendanceTracker({ attendanceRecords }: AttendanceTrackerProps) {
  const tableHeaders = [
    'Employee ID',
    'Date',
    'Check In',
    'Check Out',
    'Status',
  ];

  const tableData = attendanceRecords.map((record) => [
    record.employeeId,
    record.date,
    record.checkIn,
    record.checkOut,
    record.status,
  ]);

  return (
    <div className="attendance-tracker">
      <Card title="Attendance Records" />
      <Table headers={tableHeaders} data={tableData} />
    </div>
  );
}

export default AttendanceTracker;