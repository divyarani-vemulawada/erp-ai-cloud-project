
import {FaBell,FaEnvelope,FaSearch,FaBars} from "react-icons/fa";
function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-left">
        <FaBars className="menu-icon" />
        <div className="search-box">
          <input type="text" placeholder="Search anything..."/>
          <FaSearch className="search-icon" />
        </div>
      </div>
      <div className="nav-right">
        <FaBell className="nav-icon" />
        <FaEnvelope className="nav-icon" />
        <div className="profile">
          <img src="guest.png" alt="profile" className="profile-img"/>
          <div>
            <h4>Gnanesh</h4>
            <p>Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;