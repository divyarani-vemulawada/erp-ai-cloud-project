import MainLayout from '../../layout/Mainlayout';
import EmployeeList from '../../components/HR/EmployeeList';
import { employees } from '../../services/mock/hrMockData';

function Employees() {
  return (
    <MainLayout>
      <div className="employees-page">
        <h1>Employee Management</h1>
        <EmployeeList employees={employees} />
      </div>
    </MainLayout>
  );
}

export default Employees;
