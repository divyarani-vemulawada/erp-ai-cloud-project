import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ color: "#1a2a6c" }}>Welcome, {user?.name || "User"} 👋</h1>
      <p style={{ color: "#666" }}>You are logged in as <strong>{user?.role}</strong></p>

      <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap" }}>
        {[
          { label: "Total Employees", value: "6", color: "#1a2a6c" },
          { label: "Present Today", value: "5", color: "#28a745" },
          { label: "On Leave", value: "1", color: "#ffc107" },
          { label: "Pending Approvals", value: "3", color: "#dc3545" },
        ].map((card) => (
          <div key={card.label} style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            minWidth: "180px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            borderTop: `4px solid ${card.color}`
          }}>
            <h3 style={{ color: card.color, fontSize: "32px", margin: 0 }}>{card.value}</h3>
            <p style={{ color: "#666", marginTop: "8px" }}>{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;