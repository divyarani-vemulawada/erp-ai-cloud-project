import { Routes, Route, Navigate } from 'react-router-dom';
import Employees from './pages/HR/Employees';
import EmployeeDetail from './pages/EmployeeDetail';
import Attendance from './pages/HR/Attendance';
import Leave from './pages/HR/Leave';
import Payroll from './pages/HR/Payroll';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
      <Route path="/employees/:employeeId" element={<PrivateRoute><EmployeeDetail /></PrivateRoute>} />
      <Route path="/hr" element={<Navigate to="/employees" replace />} />
      <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
      <Route path="/leave" element={<PrivateRoute><Leave /></PrivateRoute>} />
      <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;