import React, { useEffect, useState } from "react";
import { getAuditLogs } from "../../services/auditLogService";
import type { AuditLogItem } from "../../services/auditLogService";
import { FaShieldAlt, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";

export const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [emailQuery, setEmailQuery] = useState("");
  const [actionQuery, setActionQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuditLogs({
        page,
        limit: 15,
        email: emailQuery,
        action: actionQuery,
      });
      setLogs(data.logs);
      setTotalPages(data.pages);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch compliance logs. Access restricted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <FaShieldAlt style={{ fontSize: "20px", color: "#ef4444" }} />
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
          Immutable Audit Trail & Compliance Log (F-09)
        </h3>
      </div>
      <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 20px 0" }}>
        Real-time logging of all database mutations. Tamper-evident architecture with administrative access control.
      </p>

      {/* Filter Form */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", fontWeight: 600 }}>Filter User Email</label>
          <input type="text" className="input" placeholder="e.g. admin@amdox.com" value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", fontWeight: 600 }}>Filter Action</label>
          <input type="text" className="input" placeholder="e.g. Create Employee" value={actionQuery} onChange={(e) => setActionQuery(e.target.value)} />
        </div>
        <button type="submit" className="btn" style={{ minHeight: "44px", padding: "0 20px", gap: "6px" }}>
          <FaSearch /> Filter Trail
        </button>
      </form>

      {error && (
        <div style={{ padding: "12px", background: "#fef2f2", color: "#dc2626", borderRadius: "8px", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>Querying compliance vault...</div>
      ) : logs.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No audit log entries recorded matching criteria.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "160px" }}>Timestamp</th>
                <th>User Email</th>
                <th>Role</th>
                <th>Operation Action</th>
                <th style={{ width: "90px" }}>Method</th>
                <th style={{ width: "100px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isExpanded = expandedLogId === log._id;
                return (
                  <React.Fragment key={log._id}>
                    <tr>
                      <td style={{ fontSize: "12px", color: "#64748b" }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 600 }}>{log.email}</td>
                      <td>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "#e2e8f0", color: "#475569", fontWeight: 600 }}>
                          {log.role}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: log.action.includes("Delete") ? "#dc2626" : "#0f172a" }}>
                          {log.action}
                        </strong>
                      </td>
                      <td>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: log.method === "POST" ? "#dcfce7" : log.method === "PUT" ? "#eff6ff" : "#fef2f2",
                          color: log.method === "POST" ? "#16a34a" : log.method === "PUT" ? "#2563eb" : "#dc2626",
                        }}>
                          {log.method}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => toggleExpand(log._id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          {isExpanded ? <FaChevronUp /> : <FaChevronDown />} JSON
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} style={{ background: "#f8fafc", padding: "14px" }}>
                          <div style={{ fontSize: "11px", color: "#475569" }}>
                            <strong>Mutation Payload Parameters:</strong>
                            <pre style={{
                              marginTop: "6px",
                              padding: "10px",
                              background: "#0f172a",
                              color: "#38bdf8",
                              borderRadius: "8px",
                              overflowX: "auto",
                              fontFamily: "Courier, monospace",
                            }}>
                              {JSON.stringify(JSON.parse(log.details || "{}"), null, 2)}
                            </pre>
                            <div style={{ marginTop: "8px", fontSize: "11px", color: "#94a3b8" }}>
                              <strong>Target Route:</strong> <code>{log.path}</code> | <strong>Host Address:</strong> <code>{log.ip}</code>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
          <button className="btn" disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: "0 14px", minHeight: "36px" }}>
            Prev
          </button>
          <span style={{ alignSelf: "center", fontSize: "14px", fontWeight: 600 }}>
            Page {page} of {totalPages}
          </span>
          <button className="btn" disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ padding: "0 14px", minHeight: "36px" }}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
