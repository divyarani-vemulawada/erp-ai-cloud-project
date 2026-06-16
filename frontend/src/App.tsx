import { Routes, Route, Navigate } from 'react-router-dom'
import Employees from './pages/HR/Employees'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/hr" element={<Employees />} />
    </Routes>
  )
}

export default App