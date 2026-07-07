import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome, FaMoneyBill, FaChartBar, FaCog,
  FaUsers, FaCalendarAlt, FaFileAlt, FaDollarSign,
  FaChevronRight, FaChevronDown,
} from 'react-icons/fa';
import { MdPeople, MdOutlineInventory } from 'react-icons/md';
import { useSidebar } from '../context/SidebarContext';

function Sidebar() {
  const [hrExpanded, setHrExpanded] = useState(false);
  const { isOpen } = useSidebar();

  if (!isOpen) return null;

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
                <li><Link to="/employees"><FaUsers /> Employees</Link></li>
                <li><Link to="/attendance"><FaCalendarAlt /> Attendance</Link></li>
                <li><Link to="/leave"><FaFileAlt /> Leave</Link></li>
                <li><Link to="/payroll"><FaDollarSign /> Payroll</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/finance"><FaMoneyBill /> Finance</Link>
          </li>
          <li>
            <Link to="/supply-chain"><MdOutlineInventory /> Supply Chain</Link>
          </li>
          <li>
            <Link to="/reports"><FaChartBar /> Reports</Link>
          </li>
          <li>
            <Link to="/settings"><FaCog /> Settings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;