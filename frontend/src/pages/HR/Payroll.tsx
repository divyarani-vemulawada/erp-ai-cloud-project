import MainLayout from '../../layout/Mainlayout';
import PayrollDashboard from '../../components/HR/PayrollDashboard';
import { payrollRecords } from '../../services/mock/hrMockData';

function Payroll() {
  return (
    <MainLayout>
      <div className="payroll-page">
        <div className="page-header">
          <h1>Payroll Management</h1>
        </div>
        <PayrollDashboard payrollRecords={payrollRecords} />
      </div>
    </MainLayout>
  );
}

export default Payroll;
