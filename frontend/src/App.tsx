import { useState } from 'react'

import MainLayout from './layout/Mainlayout'
import Button from './components/common/Button'
import Input from './components/common/Input'
import Card from './components/common/Card'
import Table from './components/common/Table'
import Modal from './components/common/Modal'
function App() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <>
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