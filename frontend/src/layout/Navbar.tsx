import { FaBell, FaEnvelope, FaSearch, FaBars, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const notifications = [
  { id: 1, text: "New leave request from Arjun Reddy", time: "5 min ago", read: false },
  { id: 2, text: "Payroll processed for December", time: "1 hour ago", read: false },
  { id: 3, text: "Attendance report is ready", time: "3 hours ago", read: true },
];

const messages = [
  { id: 1, from: "Rajesh Kumar", text: "Can you approve my leave request?", time: "10 min ago", read: false },
  { id: 2, from: "Priya Sharma", text: "New employee onboarding tomorrow", time: "2 hours ago", read: false },
  { id: 3, from: "Sneha Patel", text: "Salary slip needed for December", time: "1 day ago", read: true },
];

function Navbar() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [query, setQuery] = useState("");
  const [allEmployees, setAllEmployees] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = auth?.user;
  const unreadNotifs = notifications.filter(n => !n.read).length;
  const unreadMsgs = messages.filter(m => !m.read).length;

  // Load all employees once on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:1000/api/hr/employees", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setAllEmployees(res.data))
      .catch(() => setAllEmployees([]));
  }, []);

  // Filter employees as user types
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setShowSearch(false);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allEmployees.filter((emp: any) =>
      emp.fullName?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.designation?.toLowerCase().includes(q)
    );
    setResults(filtered);
    setShowSearch(true);
  }, [query, allEmployees]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(e.target as Node)) {
        setShowMessages(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    auth?.logout();
    navigate("/");
  };

  const handleSearch = () => {
    if (query.trim().length >= 1) setShowSearch(true);
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <FaBars className="menu-icon" />

        {/* Search */}
        <div className="search-box" ref={searchRef}>
          <input
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <FaSearch
            className="search-icon"
            onClick={handleSearch}
            style={{ cursor: "pointer", pointerEvents: "all" }}
          />

          {showSearch && (
            <div className="nav-dropdown search-dropdown">
              {results.length > 0 ? results.map((emp) => (
                <div
                  key={emp.employeeId}
                  className="dropdown-item"
                  onClick={() => {
                    navigate(`/employees/${emp.employeeId}`);
                    setShowSearch(false);
                    setQuery("");
                  }}
                >
                  <div className="item-main">{emp.fullName}</div>
                  <div className="item-sub">
                    {emp.employeeId} · {emp.department} · {emp.designation}
                  </div>
                </div>
              )) : (
                <div className="dropdown-item">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="nav-right">

        {/* Notifications */}
        <div className="nav-icon-wrap" ref={notifRef}>
          <FaBell className="nav-icon" onClick={() => {
            setShowNotifications(!showNotifications);
            setShowMessages(false);
            setShowProfile(false);
          }} />
          {unreadNotifs > 0 && <span className="badge">{unreadNotifs}</span>}

          {showNotifications && (
            <div className="nav-dropdown">
              <div className="dropdown-header">Notifications</div>
              {notifications.map(n => (
                <div key={n.id} className={`dropdown-item ${!n.read ? "unread" : ""}`}>
                  <div className="item-main">{n.text}</div>
                  <div className="item-sub">{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="nav-icon-wrap" ref={msgRef}>
          <FaEnvelope className="nav-icon" onClick={() => {
            setShowMessages(!showMessages);
            setShowNotifications(false);
            setShowProfile(false);
          }} />
          {unreadMsgs > 0 && <span className="badge">{unreadMsgs}</span>}

          {showMessages && (
            <div className="nav-dropdown">
              <div className="dropdown-header">Messages</div>
              {messages.map(m => (
                <div key={m.id} className={`dropdown-item ${!m.read ? "unread" : ""}`}>
                  <div className="item-main"><strong>{m.from}</strong></div>
                  <div className="item-sub">{m.text}</div>
                  <div className="item-sub">{m.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile" ref={profileRef} onClick={() => {
          setShowProfile(!showProfile);
          setShowNotifications(false);
          setShowMessages(false);
        }}>
          <img src="guest.png" alt="profile" className="profile-img" />
          <div>
            <h4>{user?.name || "User"}</h4>
            <p>{user?.role || "Admin"}</p>
          </div>

          {showProfile && (
            <div className="nav-dropdown profile-dropdown">
              <div className="profile-header">
                <img src="guest.png" alt="profile" className="profile-header-img" />
                <div>
                  <strong>{user?.name || "User"}</strong>
                  <p>{user?.email || ""}</p>
                  <span className="role-badge">{user?.role || "Admin"}</span>
                </div>
              </div>
              <hr />
              <div className="dropdown-item profile-item" onClick={() => navigate("/profile")}>
                <FaUser /> My Profile
              </div>
              <div className="dropdown-item profile-item" onClick={() => navigate("/settings")}>
                <FaCog /> Settings
              </div>
              <hr />
              <div className="dropdown-item profile-item logout" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Navbar;