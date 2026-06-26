import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Profile = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:1000/api/users/me",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update localStorage and context
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

  const joinYear = user?.createdAt
    ? new Date(user.createdAt).getFullYear()
    : "2024";

  return (
    <div style={{ padding: "24px", maxWidth: "700px" }}>
      <h1 style={{ color: "#1a2a6c", marginBottom: "24px" }}>My Profile</h1>

      {success && (
        <div style={{
          background: "#f0fdf4", border: "1px solid #86efac",
          borderRadius: "8px", padding: "12px 16px",
          color: "#16a34a", marginBottom: "16px"
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5",
          borderRadius: "8px", padding: "12px 16px",
          color: "#dc2626", marginBottom: "16px"
        }}>
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        background: "white", borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)", overflow: "hidden"
      }}>

        {/* Cover + Avatar */}
        <div style={{
          background: "linear-gradient(135deg, #081f53, #1a2a6c)",
          height: "100px", position: "relative"
        }} />
        <div style={{ padding: "0 24px 24px", position: "relative" }}>
          <img
            src="guest.png"
            alt="profile"
            style={{
              width: "80px", height: "80px", borderRadius: "50%",
              border: "4px solid white", marginTop: "-40px",
              display: "block", background: "#e2e8f0"
            }}
          />

          <div style={{ marginTop: "12px" }}>
            {/* Name */}
            <div style={{ marginBottom: "20px" }}>
              {editMode ? (
                <div>
                  <label style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
                    USERNAME
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      display: "block", width: "100%", marginTop: "6px",
                      padding: "10px 14px", borderRadius: "8px",
                      border: "1px solid #cbd5e1", fontSize: "15px",
                      outline: "none"
                    }}
                  />
                </div>
              ) : (
                <div>
                  <h2 style={{ margin: 0, color: "#1a2a6c", fontSize: "22px" }}>
                    {user?.name}
                  </h2>
                  <span style={{
                    background: "#1a2a6c", color: "white",
                    padding: "2px 10px", borderRadius: "20px",
                    fontSize: "12px", textTransform: "capitalize",
                    display: "inline-block", marginTop: "6px"
                  }}>
                    {user?.role}
                  </span>
                </div>
              )}
            </div>

            {/* Info Grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "16px", marginBottom: "24px"
            }}>
              {[
                { label: "Email", value: user?.email, icon: "✉️" },
                { label: "Role", value: user?.role, icon: "🏷️" },
                { label: "Member Since", value: joinYear, icon: "📅" },
                { label: "Status", value: "Active", icon: "✅" },
                { label: "Department", value: "Management", icon: "🏢" },
                { label: "Location", value: "India", icon: "📍" },
              ].map((item) => (
                <div key={item.label} style={{
                  background: "#f8fafc", borderRadius: "10px",
                  padding: "14px 16px"
                }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{
                    fontSize: "15px", color: "#1e293b",
                    fontWeight: 500, marginTop: "4px",
                    textTransform: "capitalize"
                  }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                      background: "#1a2a6c", color: "white",
                      border: "none", borderRadius: "8px",
                      padding: "10px 24px", cursor: "pointer",
                      fontSize: "14px", fontWeight: 600
                    }}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => { setEditMode(false); setName(user?.name || ""); }}
                    style={{
                      background: "#f1f5f9", color: "#64748b",
                      border: "none", borderRadius: "8px",
                      padding: "10px 24px", cursor: "pointer",
                      fontSize: "14px", fontWeight: 600
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    background: "#1a2a6c", color: "white",
                    border: "none", borderRadius: "8px",
                    padding: "10px 24px", cursor: "pointer",
                    fontSize: "14px", fontWeight: 600
                  }}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;