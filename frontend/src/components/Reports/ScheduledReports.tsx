import React, { useState } from "react";
import { FaClock, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";

interface ScheduledReportItem {
  id: string;
  title: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  recipient: string;
  format: "CSV" | "PDF";
  lastRun?: string;
}

export const ScheduledReports: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduledReportItem[]>([
    { id: "1", title: "Financial Ledger Summary", frequency: "Monthly", recipient: "cfo@amdox.com", format: "PDF", lastRun: "2026-06-30" },
    { id: "2", title: "SCM Stock Shortage Log", frequency: "Daily", recipient: "warehouse@amdox.com", format: "CSV", lastRun: "2026-07-02" },
    { id: "3", title: "Active Projects Milestones", frequency: "Weekly", recipient: "pm-office@amdox.com", format: "PDF", lastRun: "2026-07-01" },
  ]);

  const [title, setTitle] = useState("Finance Transaction Audits");
  const [frequency, setFrequency] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [recipient, setRecipient] = useState("");
  const [format, setFormat] = useState<"CSV" | "PDF">("CSV");
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) return;
    const newSchedule: ScheduledReportItem = {
      id: String(Date.now()),
      title,
      frequency,
      recipient,
      format,
    };
    setSchedules([...schedules, newSchedule]);
    setRecipient("");
    setShowForm(false);
    toast.success(`Scheduled delivery of "${title}" to ${recipient} successfully!`);
  };

  const handleDelete = (id: string) => {
    const sched = schedules.find(s => s.id === id);
    setSchedules(schedules.filter((s) => s.id !== id));
    toast.info(`Automated run for "${sched?.title || 'Report'}" removed.`);
  };

  return (
    <div className="card" style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Scheduled Report Runs</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Automate background reporting exports sent directly to emails.</p>
        </div>
        <button className="btn" style={{ gap: "6px", minHeight: "36px", fontSize: "13px" }} onClick={() => setShowForm(!showForm)}>
          <FaPlus style={{ marginRight: "4px" }} /> {showForm ? "Close Form" : "Schedule New Report"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ background: "#f8fafc", padding: "18px", borderRadius: "12px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Report Type</label>
              <select className="form-select" value={title} onChange={(e) => setTitle(e.target.value)}>
                <option value="HR Employee Directory">HR Employee Directory</option>
                <option value="Finance Transaction Audits">Finance Transaction Audits</option>
                <option value="SCM Low Stock Items">SCM Low Stock Items</option>
                <option value="Projects Spend Tracker">Projects Spend Tracker</option>
              </select>
            </div>
            <div className="form-group">
              <label>Recipient Email</label>
              <input type="email" className="input" placeholder="e.g. admin@amdox.com" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group">
              <label>Frequency</label>
              <select className="form-select" value={frequency} onChange={(e: any) => setFrequency(e.target.value)}>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Format</label>
              <select className="form-select" value={format} onChange={(e: any) => setFormat(e.target.value)}>
                <option value="CSV">CSV</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn" style={{ alignSelf: "flex-end", minHeight: "36px", fontSize: "13px" }}>
            Schedule Automation
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Report Title</th>
              <th>Frequency</th>
              <th>Recipient</th>
              <th>Format</th>
              <th>Last Sent Run</th>
              <th className="table-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sched) => (
              <tr key={sched.id}>
                <td style={{ fontWeight: 600, color: "#0f172a" }}>
                  <FaClock style={{ marginRight: "8px", color: "#64748b" }} />
                  {sched.title}
                </td>
                <td><span style={{ padding: "4px 8px", borderRadius: "6px", background: "#fffbeb", color: "#d97706", fontWeight: 700, fontSize: "11px" }}>{sched.frequency}</span></td>
                <td>{sched.recipient}</td>
                <td><strong>{sched.format}</strong></td>
                <td>{sched.lastRun || "Never (Pending)"}</td>
                <td className="table-actions">
                  <button className="btn btn-danger" style={{ padding: "0 10px", minHeight: "30px", fontSize: "11px" }} onClick={() => handleDelete(sched.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduledReports;
