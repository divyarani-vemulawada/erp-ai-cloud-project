import type { LeaveRequest } from '../../types/hr';
import Card from '../common/Card';
import Button from '../common/Button';

type LeaveManagementProps = {
  leaveRequests: LeaveRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

function LeaveManagement({ leaveRequests, onApprove, onReject }: LeaveManagementProps) {
  const hasActions = Boolean(onApprove || onReject);

  return (
    <div className="leave-management">
      <Card title="Leave Requests" />
      <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            {hasActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((req) => (
            <tr key={req.id}>
              <td>{req.employeeId}</td>
              <td>{req.leaveType}</td>
              <td>{req.startDate}</td>
              <td>{req.endDate}</td>
              <td>{req.reason}</td>
              <td>{req.status}</td>
              {hasActions && (
                <td className="table-actions">
                  {req.status === 'Pending' && onApprove && (
                    <Button
                      text="Approve"
                      onClick={() => onApprove(req.id)}
                      type="button"
                    />
                  )}
                  {req.status === 'Pending' && onReject && (
                    <Button
                      text="Reject"
                      onClick={() => onReject(req.id)}
                      type="button"
                      variant="danger"
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

export default LeaveManagement;
