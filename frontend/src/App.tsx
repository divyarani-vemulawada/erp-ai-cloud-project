import { Routes, Route, Navigate } from 'react-router-dom';
import Employees from './pages/HR/Employees';
import Attendance from './pages/HR/Attendance';
import Leave from './pages/HR/Leave';
import Payroll from './pages/HR/Payroll';

import Register from './pages/Register'
import Login from './pages/Login'

import PrivateRoute from './components/Auth/PrivateRoute'

function App() {
  return (

    <>
    
     <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path='/register' element={<Register/>}/>

       <Route path="/employees" element={<PrivateRoute><Employees /></PrivateRoute>} />
      {/* <Route path="/" element={<Navigate to="/employees" replace />} /> */}
      <Route path="/hr" element={<Navigate to="/employees" replace />} />

      <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
      <Route path="/leave" element={<PrivateRoute><Leave /></PrivateRoute>} />
      <Route path="/payroll" element={<PrivateRoute><Payroll /></PrivateRoute>} />

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
