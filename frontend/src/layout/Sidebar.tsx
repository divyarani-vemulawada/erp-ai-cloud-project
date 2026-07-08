import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaMoneyBill, FaChartBar, FaCog,
  FaUsers, FaCalendarAlt, FaFileAlt, FaDollarSign,
  FaChevronRight, FaChevronDown, FaClipboardList
} from 'react-icons/fa';
import { MdPeople, MdOutlineInventory } from 'react-icons/md';
import { useSidebar } from '../context/SidebarContext';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const [hrExpanded, setHrExpanded] = useState(false);
  const { isOpen } = useSidebar();
  const auth = useContext(AuthContext);
  const role = auth?.user?.role || 'employee';

  if (!isOpen) return null;

  // Role permissions checks
  const showHR = ['admin', 'hr_manager', 'employee', 'executive', 'auditor'].includes(role);
  const showFinance = ['admin', 'finance_manager', 'executive', 'auditor'].includes(role);
  const showSupplyChain = ['admin', 'supply_chain_manager', 'executive', 'auditor'].includes(role);
  const showProjects = ['admin', 'project_manager', 'employee', 'executive', 'auditor'].includes(role);
  const showReports = ['admin', 'hr_manager', 'finance_manager', 'executive', 'auditor'].includes(role);
  const showSettings = role === 'admin';

  return (
    <div className="sidebar">
      <div className="logo-section">
        <div className="brand-logo-icon" style={{ marginBottom: '12px' }}>
          <div className="square-dot-grid">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h2 className="csn">Amdox ERP</h2>
        <p className="subtitle">Smart Enterprise Suite</p>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard"><FaHome /> Dashboard</Link>
          </li>

          {showHR && (
            <li className="nav-group">
              <button
                className="nav-group-toggle"
                onClick={() => setHrExpanded((prev) => !prev)}
              >
                <MdPeople />
                <span>Human Resources</span>
                {hrExpanded ? <FaChevronDown className="nav-arrow" /> : <FaChevronRight className="nav-arrow" />}
              </button>

              {hrExpanded && (
                <ul className="nav-sub">
                  {role !== 'employee' && (
                    <li><Link to="/employees"><FaUsers /> Employees</Link></li>
                  )}
                  <li><Link to="/attendance"><FaCalendarAlt /> Attendance</Link></li>
                  <li><Link to="/leave"><FaFileAlt /> Leave</Link></li>
                  {role !== 'employee' && (
                    <li><Link to="/payroll"><FaDollarSign /> Payroll</Link></li>
                  )}
                </ul>
              )}
            </li>
          )}

          {showFinance && (
            <li>
              <Link to="/finance"><FaMoneyBill /> Finance</Link>
            </li>
          )}

          {showSupplyChain && (
            <li>
              <Link to="/supply-chain"><MdOutlineInventory /> Supply Chain</Link>
            </li>
          )}

          {showProjects && (
            <li>
              <Link to="/projects"><FaClipboardList /> Projects</Link>
            </li>
          )}

          {showReports && (
            <li>
              <Link to="/reports"><FaChartBar /> Reports</Link>
            </li>
          )}

          {showSettings && (
            <li>
              <Link to="/settings"><FaCog /> Settings</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;