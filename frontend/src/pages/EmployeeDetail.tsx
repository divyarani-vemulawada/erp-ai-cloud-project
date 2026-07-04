import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layout/Mainlayout";
import { getEmployees, getAttendance, getLeaveRequests } from "../services/hrService";

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [leave, setLeave] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEmployees(),
      getAttendance(),
      getLeaveRequests(),
    ]).then(([employees, attendance, leave]) => {
      setEmployee(employees.find((e) => e.employeeId === employeeId) ?? null);
      setAttendance(attendance.filter((a) => a.employeeId === employeeId));
      setLeave(leave.filter((l) => l.employeeId === employeeId));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [employeeId]);

  if (loading) return <MainLayout><div style={{ padding: "24px" }}>Loading...</div></MainLayout>;
  if (!employee) return <MainLayout><div style={{ padding: "24px" }}>Employee not found.</div></MainLayout>;

  const presentDays = attendance.filter(a => a.status === "Present").length;
  const absentDays = attendance.filter(a => a.status === "Absent").length;
  const totalDays = attendance.length;
  const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <MainLayout>
      <div style={{ padding: "24px", maxWidth: "900px" }}>

        {/* Back Button */}
        <button
          onClick={() => navigate("/employees")}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#6366f1", fontSize: "14px", marginBottom: "16px",
            display: "flex", alignItems: "center", gap: "6px",
            fontWeight: 600
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
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            height: "100px"
          }} />
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "#e2e8f0", border: "4px solid white",
              marginTop: "-40px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "28px", color: "#6366f1",
              fontWeight: 700
            }}>
              {employee.fullName?.charAt(0)}
            </div>

            <div style={{ marginTop: "12px" }}>
              <h2 style={{ margin: 0, color: "#4f46e5" }}>{employee.fullName}</h2>
              <span style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
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
                {
                  label: "Status", value: employee.status,
                  icon: employee.status === "Active" ? "✅" : "❌"
                },
              ].map(item => (
                <div key={item.label} style={{
                  background: "#f8fafc", borderRadius: "10px", padding: "14px 16px"
                }}>
                  <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600 }}>
                    {item.icon} {item.label}
                  </div>
                  <div style={{
                    fontSize: "14px", color: "#1e293b",
                    fontWeight: 500, marginTop: "4px"
                  }}>
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
          <h3 style={{ color: "#4f46e5", marginTop: 0 }}>📊 Attendance Summary</h3>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Present Days", value: presentDays, color: "#16a34a" },
              { label: "Absent Days", value: absentDays, color: "#dc2626" },
              { label: "Total Days", value: totalDays, color: "#6366f1" },
              {
                label: "Attendance %",
                value: `${attendancePercent}%`,
                color: attendancePercent >= 80 ? "#16a34a" : "#f59e0b"
              },
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
                  <tr style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}>
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

          {attendance.length === 0 && (
            <p style={{ color: "#94a3b8", marginTop: "16px" }}>No attendance records found.</p>
          )}
        </div>

        {/* Leave History */}
        <div style={{
          background: "white", borderRadius: "16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "24px"
        }}>
          <h3 style={{ color: "#4f46e5", marginTop: 0 }}>🗓️ Leave History</h3>
          {leave.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No leave records found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white" }}>
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
                          background: l.status === "Approved" ? "#dcfce7"
                            : l.status === "Rejected" ? "#fee2e2" : "#fef9c3",
                          color: l.status === "Approved" ? "#16a34a"
                            : l.status === "Rejected" ? "#dc2626" : "#b45309",
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
    </MainLayout>
  );
};

export default EmployeeDetail;