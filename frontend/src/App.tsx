import { Routes, Route, Navigate } from 'react-router-dom';
import Employees from './pages/HR/Employees';
import Attendance from './pages/HR/Attendance';
import Leave from './pages/HR/Leave';
import Payroll from './pages/HR/Payroll';

import MainLayout from './layout/Mainlayout'
import Button from './components/common/Button'
import Input from './components/common/Input'
import Card from './components/common/Card'
import Table from './components/common/Table'
import Modal from './components/common/Modal'
import Register from './pages/Register'
import Login from './pages/Login'

import PrivateRoute from './components/Auth/PrivateRoute'
import RoleRoute from './components/Auth/RoleRoute'

function App() {
  return (

    <>
    
     <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path='/register' element={<Register/>}/>

       <Route path="/employees" element={<Employees />} />
      {/* <Route path="/" element={<Navigate to="/employees" replace />} /> */}
      <Route path="/hr" element={<Navigate to="/employees" replace />} />
      
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/leave" element={<Leave />} />
      <Route path="/payroll" element={<Payroll />} />

     </Routes>
     
    
    
    {/* <Route path='/admin' element={
        <PrivateRoute>
          <RoleRoute role="admin">
            <AdminDashboard/>
          </RoleRoute>
        </PrivateRoute>
    }/>
    <Route path='/hr' element={
        <PrivateRoute>
          <RoleRoute role="hr">
            <HrDashboard/>
          </RoleRoute>
        </PrivateRoute>
    }/> */}
      {/* <MainLayout>
      <Input type="text"  placeholder="Enter Employee ID"/>
      <Input type="text"  placeholder="Enter Employee Name" />
      <Input type="email" placeholder="Enter Company Email"/>
      <Card title="Employee Details" />
      <Button text="Add Employee" />
      <Table headers={["Employee ID","Name","Department"]}
        data={[["2024005202", "Gnanesh", "Manager"],["2024002964", "Nanditha", "HR"]]}/>
      <Modal title="Add Employee" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </MainLayout> */}
    </>
      
  );

}

export default App;
