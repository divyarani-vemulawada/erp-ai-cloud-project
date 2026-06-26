import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leave, setLeave] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get("http://localhost:1000/api/hr/employees", { headers }),
      axios.get("http://localhost:1000/api/hr/attendance", { headers }),
      axios.get("http://localhost:1000/api/hr/leave", { headers }),
    ]).then(([empRes, attRes, leaveRes]) => {
      const emp = empRes.data.find((e: any) => e.employeeId === employeeId);
      setEmployee(emp);
      setAttendance(attRes.data.filter((a: any) => a.employeeId === employeeId));
      setLeave(leaveRes.data.filter((l: any) => l.employeeId === employeeId));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [employeeId]);

  if (loading) return <div style={{ padding: "24px" }}>Loading...</div>;
  if (!employee) return <div style={{ padding: "24px" }}>Employee not found.</div>;

  const presentDays = attendance.filter(a => a.status === "Present").length;
  const absentDays = attendance.filter(a => a.status === "Absent").length;
  const totalDays = attendance.length;
  const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div style={{ padding: "24px", maxWidth: "900px" }}>

      {/* Back Button */}
      <button
        onClick={() => navigate("/employees")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#1a2a6c", fontSize: "14px", marginBottom: "16px",
          display: "flex", alignItems: "center", gap: "6px"
        }}
      >
        ← Back to Employees
      </button>

      {/* Profile Card */}
      <div style={{
        background: "white", borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        overflow: "hidden", marginBottom: "24px"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #081f53, #1a2a6c)",
          height: "100px"
        }} />
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "#e2e8f0", border: "4px solid white",
            marginTop: "-40px", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "28px", color: "#1a2a6c",
            fontWeight: 700
          }}>
            {employee.fullName?.charAt(0)}
          </div>
          <div style={{ marginTop: "12px" }}>
            <h2 style={{ margin: 0, color: "#1a2a6c" }}>{employee.fullName}</h2>
            <span style={{
              background: "#1a2a6c", color: "white",
              padding: "2px 10px", borderRadius: "20px",
              fontSize: "12px", display: "inline-block", marginTop: "6px"
            }}>
              {employee.designation}
            </span>
          </div>

          {/* Info Grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px", marginTop: "20px"
          }}>
            {[
              { label: "Employee ID", value: employee.employeeId, icon: "🪪" },
              { label: "Email", value: employee.email, icon: "✉️" },
              { label: "Phone", value: employee.phone, icon: "📞" },
              { label: "Department", value: employee.department, icon: "🏢" },
              { label: "Joining Date", value: employee.joiningDate, icon: "📅" },
              { label: "Status", value: employee.status, icon: employee.status === "Active" ? "✅" : "❌" },
            ].map(item => (
              <div key={item.label} style={{
                background: "#f8fafc", borderRadius: "10px", padding: "14px 16px"
              }}>
                <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500, marginTop: "4px" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div style={{
        background: "white", borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "24px", marginBottom: "24px"
      }}>
        <h3 style={{ color: "#1a2a6c", marginTop: 0 }}>📊 Attendance Summary</h3>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[
            { label: "Present Days", value: presentDays, color: "#16a34a" },
            { label: "Absent Days", value: absentDays, color: "#dc2626" },
            { label: "Total Days", value: totalDays, color: "#1a2a6c" },
            { label: "Attendance %", value: `${attendancePercent}%`, color: attendancePercent >= 80 ? "#16a34a" : "#f59e0b" },
          ].map(item => (
            <div key={item.label} style={{
              background: "#f8fafc", borderRadius: "10px",
              padding: "16px 24px", flex: "1", minWidth: "120px",
              borderTop: `4px solid ${item.color}`
            }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: item.color }}>
                {item.value}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Records Table */}
        {attendance.length > 0 && (
          <div style={{ marginTop: "20px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#081f53", color: "white" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Check In</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Check Out</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px 14px" }}>{a.date}</td>
                    <td style={{ padding: "10px 14px" }}>{a.checkIn || "—"}</td>
                    <td style={{ padding: "10px 14px" }}>{a.checkOut || "—"}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        background: a.status === "Present" ? "#dcfce7" : "#fee2e2",
                        color: a.status === "Present" ? "#16a34a" : "#dc2626",
                        padding: "2px 10px", borderRadius: "20px", fontSize: "12px"
                      }}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Leave History */}
      <div style={{
        background: "white", borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "24px"
      }}>
        <h3 style={{ color: "#1a2a6c", marginTop: 0 }}>🗓️ Leave History</h3>
        {leave.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No leave records found.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#081f53", color: "white" }}>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Start</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>End</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Reason</th>
                  <th style={{ padding: "10px 14px", textAlign: "left" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {leave.map((l, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px 14px" }}>{l.leaveType}</td>
                    <td style={{ padding: "10px 14px" }}>{l.startDate}</td>
                    <td style={{ padding: "10px 14px" }}>{l.endDate}</td>
                    <td style={{ padding: "10px 14px" }}>{l.reason}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{
                        background: l.status === "Approved" ? "#dcfce7" : l.status === "Rejected" ? "#fee2e2" : "#fef9c3",
                        color: l.status === "Approved" ? "#16a34a" : l.status === "Rejected" ? "#dc2626" : "#b45309",
                        padding: "2px 10px", borderRadius: "20px", fontSize: "12px"
                      }}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;