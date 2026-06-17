import MainLayout from '../../layout/Mainlayout';
import AttendanceTracker from '../../components/HR/AttendanceTracker';
import { attendanceRecords } from '../../services/mock/hrMockData';

function Attendance() {
  return (
    <MainLayout>
      <div className="attendance-page">
        <div className="page-header">
          <h1>Attendance Management</h1>
        </div>

        <AttendanceTracker attendanceRecords={attendanceRecords} />
      </div>
    </MainLayout>
  );
}

export default Attendance;
