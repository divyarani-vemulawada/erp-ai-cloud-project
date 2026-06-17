import {FaHome,FaMoneyBill,FaChartBar,FaCog} from "react-icons/fa";
import {MdPeople,MdOutlineInventory} from "react-icons/md";
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <h2 className="csn"> ERP Cloud AI</h2>
        <p className="subtitle">Smart Enterprise Suite</p>
      </div>
      <nav>
        <ul>
          <li>
            <a href="/"><FaHome />Dashboard</a>
          </li>
          <li>
            <a href="/hr"><MdPeople />HR Module</a>
          </li>
          <li>
            <a href="/finance"><FaMoneyBill /> Finance</a>
          </li>
          <li>
            <a href="/supply-chain"><MdOutlineInventory />Supply Chain</a>
          </li>
          <li>
            <a href="/reports"><FaChartBar />Reports</a>
          </li>
          <li>
            <a href="/settings"> <FaCog />Settings</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;