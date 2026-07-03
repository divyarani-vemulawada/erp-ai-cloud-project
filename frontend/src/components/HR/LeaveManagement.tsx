import { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(leaveRequests.length / rowsPerPage);
  const displayedRequests = leaveRequests.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
              {hasActions && <th className="table-actions">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {displayedRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.employeeId}</td>
                <td>{req.leaveType}</td>
                <td>{req.startDate}</td>
                <td>{req.endDate}</td>
                <td>{req.reason}</td>
                <td>
                  <span className={`status-pill status-${req.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {req.status}
                  </span>
                </td>
                {hasActions && (
                  <td className="table-actions">
                    <div className="action-buttons">
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
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination-wrapper">
          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveManagement;
