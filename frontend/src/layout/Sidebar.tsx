import { Link } from 'react-router-dom';
import { FaHome, FaMoneyBill, FaChartBar, FaCog, FaUsers, FaCalendarAlt, FaFileAlt, FaDollarSign } from 'react-icons/fa';
import { MdPeople, MdOutlineInventory } from 'react-icons/md';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <h2 className="csn">ERP Cloud AI</h2>
        <p className="subtitle">Smart Enterprise Suite</p>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/"><FaHome /> Dashboard</Link>
          </li>
          <li className="nav-group">
            <span className="nav-group-label"><MdPeople /> Human Resources</span>
            <ul className="nav-sub">
              <li><Link to="/employees"><FaUsers /> Employees</Link></li>
              <li><Link to="/attendance"><FaCalendarAlt /> Attendance</Link></li>
              <li><Link to="/leave"><FaFileAlt /> Leave</Link></li>
              <li><Link to="/payroll"><FaDollarSign /> Payroll</Link></li>
            </ul>
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
