import { useState } from 'react'

import MainLayout from './layout/Mainlayout'
import Button from './components/common/Button'
import Input from './components/common/Input'
import Card from './components/common/Card'
import Table from './components/common/Table'
import Modal from './components/common/Modal'
import Register from './pages/Register'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/Auth/PrivateRoute'
import RoleRoute from './components/Auth/RoleRoute'
function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <>
    <BrowserRouter>
     <Routes>
       <Route path='/' element={<Login/>}/>
       <Route path='/register' element={<Register/>}/>
     </Routes>
    </BrowserRouter>
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
      <MainLayout>
      <Input type="text"  placeholder="Enter Employee ID"/>
      <Input type="text"  placeholder="Enter Employee Name" />
      <Input type="email" placeholder="Enter Company Email"/>
      <Card title="Employee Details" />
      <Button text="Add Employee" />
      <Table headers={["Employee ID","Name","Department"]}
        data={[["2024005202", "Gnanesh", "Manager"],["2024002964", "Nanditha", "HR"]]}/>
      <Modal title="Add Employee" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
        </MainLayout>
    </>
      
  )
}
export default App