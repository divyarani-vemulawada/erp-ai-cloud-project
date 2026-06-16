import { Routes, Route } from 'react-router-dom'
import Employees from './pages/HR/Employees'

function App() {
  return (
    <Routes>
      <Route path="/employees" element={<Employees />} />
    </Routes>
  )
}

export default App