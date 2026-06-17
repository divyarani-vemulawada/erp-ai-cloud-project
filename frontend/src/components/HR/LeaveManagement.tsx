import type { LeaveRequest } from '../../types/hr';
import Table from '../common/Table';
import Card from '../common/Card';

type LeaveManagementProps = {
  leaveRequests: LeaveRequest[];
};

function LeaveManagement({ leaveRequests }: LeaveManagementProps) {
  const tableHeaders = [
    'Employee ID',
    'Leave Type',
    'Start Date',
    'End Date',
    'Reason',
    'Status',
  ];

  const tableData = leaveRequests.map((req) => [
    req.employeeId,
    req.leaveType,
    req.startDate,
    req.endDate,
    req.reason,
    req.status,
  ]);

  return (
    <div className="leave-management">
      <Card title="Leave Requests" />
      <Table headers={tableHeaders} data={tableData} />
    </div>
  );
}

export default LeaveManagement;
