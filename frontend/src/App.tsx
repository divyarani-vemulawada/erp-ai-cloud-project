import { Routes, Route, Navigate } from 'react-router-dom';
import Employees from './pages/HR/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Attendance from './pages/HR/Attendance';
import Leave from './pages/HR/Leave';
import Payroll from './pages/HR/Payroll';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Finance from './pages/Finance';
import SupplyChain from './pages/SupplyChain';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute allowedRoles={['admin', 'hr_manager', 'auditor', 'executive']}><Employees /></PrivateRoute>} />
      <Route path="/employees/:employeeId" element={<PrivateRoute allowedRoles={['admin', 'hr_manager', 'auditor', 'executive']}><EmployeeDetail /></PrivateRoute>} />
      <Route path="/hr" element={<Navigate to="/employees" replace />} />
      <Route path="/attendance" element={<PrivateRoute allowedRoles={['admin', 'hr_manager', 'employee', 'auditor', 'executive']}><Attendance /></PrivateRoute>} />
      <Route path="/leave" element={<PrivateRoute allowedRoles={['admin', 'hr_manager', 'employee', 'auditor', 'executive']}><Leave /></PrivateRoute>} />
      <Route path="/payroll" element={<PrivateRoute allowedRoles={['admin', 'hr_manager', 'auditor', 'executive']}><Payroll /></PrivateRoute>} />
      <Route path="/finance" element={<PrivateRoute allowedRoles={['admin', 'finance_manager', 'auditor', 'executive']}><Finance /></PrivateRoute>} />
      <Route path="/supply-chain" element={<PrivateRoute allowedRoles={['admin', 'supply_chain_manager', 'auditor', 'executive']}><SupplyChain /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute allowedRoles={['admin', 'project_manager', 'employee', 'auditor', 'executive']}><Projects /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute allowedRoles={['admin', 'hr_manager', 'finance_manager', 'executive', 'auditor']}><Reports /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute allowedRoles={['admin']}><Settings /></PrivateRoute>} />
      <Route path="/profile" element={<Navigate to="/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
