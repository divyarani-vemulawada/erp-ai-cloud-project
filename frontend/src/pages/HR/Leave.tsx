import MainLayout from '../../layout/Mainlayout';
import LeaveManagement from '../../components/HR/LeaveManagement';
import { leaveRequests } from '../../services/mock/hrMockData';

function Leave() {
  return (
    <MainLayout>
      <div className="leave-page">
        <div className="page-header">
          <h1>Leave Management</h1>
        </div>
        <LeaveManagement leaveRequests={leaveRequests} />
      </div>
    </MainLayout>
  );
}

export default Leave;
