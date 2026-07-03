import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import axios from "axios";
import { FaTimes, FaEnvelope, FaTag, FaCalendarAlt, FaCheckCircle, FaBuilding, FaMapMarkerAlt, FaEdit, FaSave } from "react-icons/fa";

function ProfileDrawer() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const { isProfileOpen, setIsProfileOpen } = useSidebar();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user, isProfileOpen]);

  if (!isProfileOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:1000/api/users/me",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = { ...user, name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      auth?.login(updatedUser, token!);
      setSuccess("Profile updated successfully!");
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    auth?.logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const joinYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "2024";

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        onClick={() => setIsProfileOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(15, 23, 42, 0.15)",
          backdropFilter: "blur(4px)",
          zIndex: 999,
          cursor: "pointer"
        }}
      />

      {/* Slide-out Drawer */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "380px",
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          boxShadow: "-10px 0 30px rgba(99, 102, 241, 0.05)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
          zIndex: 1000,
          padding: "30px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          overflowY: "auto"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>User Profile</h3>
          <button 
            onClick={() => setIsProfileOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Feedback alerts */}
        {success && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #86efac",
            borderRadius: "10px", padding: "10px 14px",
            color: "#16a34a", fontSize: "12px", fontWeight: 500
          }}>
            {success}
          </div>
        )}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: "10px", padding: "10px 14px",
            color: "#dc2626", fontSize: "12px", fontWeight: 500
          }}>
            {error}
          </div>
        )}

        {/* Profile Card section */}
        <div style={{ textAlign: "center" }}>
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || "Jonas"}`} 
            alt="Avatar" 
            style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#e0e7ff", padding: "4px", border: "2px solid #6366f1", margin: "0 auto 12px auto" }}
          />
          
          {editMode ? (
            <div style={{ textAlign: "left", marginBottom: "16px" }}>
              <label style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Username</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  marginTop: "6px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                  fontWeight: 500,
                  outline: "none",
                  background: "rgba(255, 255, 255, 0.6)"
                }}
              />
            </div>
          ) : (
            <>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>{user?.name || "Jonas Kanwald"}</h3>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>{user?.role || "Administrator"}</span>
            </>
          )}
        </div>

        {/* Profile Details Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { label: "Email", value: user?.email, icon: <FaEnvelope style={{ color: "#6366f1" }} /> },
            { label: "Role Tag", value: user?.role, icon: <FaTag style={{ color: "#6366f1" }} /> },
            { label: "Member Since", value: joinYear, icon: <FaCalendarAlt style={{ color: "#6366f1" }} /> },
            { label: "Status", value: "Active", icon: <FaCheckCircle style={{ color: "#10b981" }} /> },
            { label: "Department", value: "Management", icon: <FaBuilding style={{ color: "#6366f1" }} /> },
            { label: "Location", value: "India", icon: <FaMapMarkerAlt style={{ color: "#6366f1" }} /> },
          ].map((item, idx) => (
            <div 
              key={idx} 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                borderRadius: "14px"
              }}
            >
              <div style={{ fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155", marginTop: "2px", textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
          {editMode ? (
            <div style={{ display: "flex", gap: "10px" }}>
              <button 
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex: 1,
                  minHeight: "40px",
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <FaSave /> {loading ? "Saving..." : "Save"}
              </button>
              <button 
                onClick={() => { setEditMode(false); setName(user?.name || ""); }}
                style={{
                  flex: 1,
                  minHeight: "40px",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setEditMode(true)}
                style={{
                  width: "100%",
                  minHeight: "42px",
                  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <FaEdit /> Edit Profile
              </button>
              
              <button 
                onClick={handleLogout}
                style={{
                  width: "100%",
                  minHeight: "42px",
                  background: "transparent",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileDrawer;
