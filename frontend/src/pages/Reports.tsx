import { useCallback, useEffect, useState, useContext } from 'react';
import MainLayout from '../layout/Mainlayout';
import Card from '../components/common/Card';
import type { ReportSummary } from '../types/dashboard';
import { getReportSummary } from '../services/reportService';
import { AuthContext } from "../context/AuthContext";

// BI & Audit Components
import ReportBuilder from '../components/Reports/ReportBuilder';
import ScheduledReports from '../components/Reports/ScheduledReports';
import AuditLog from '../components/Reports/AuditLog';

function Reports() {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [activeTab, setActiveTab] = useState<'builder' | 'audit' | 'summary'>('builder');
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setError(null);
      setSummary(await getReportSummary());
    } catch {
      setError('Failed to load report summary.');
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const isAdmin = user?.role === 'admin';

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: "12px 22px",
    border: "none",
    background: "none",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    color: activeTab === tab ? "#6366f1" : "#64748b",
    borderBottom: activeTab === tab ? "3px solid #6366f1" : "3px solid transparent",
    transition: "all 0.2s ease",
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <MainLayout>
      <div className="module-page" style={{ padding: "0 10px" }}>

        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#6366f1", letterSpacing: "-0.02em" }}>
              Business Intelligence &amp; Auditing
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" }}>
              Dynamic report builder, compliance logging, and system automation utilities.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: "24px", gap: "4px" }}>
          <button onClick={() => setActiveTab('builder')} style={tabStyle('builder')}>
            BI Report Builder
          </button>
          <button onClick={() => setActiveTab('audit')} style={tabStyle('audit')}>
            Audit Trail Logs
          </button>
          <button onClick={() => setActiveTab('summary')} style={tabStyle('summary')}>
            Metrics Overview
          </button>
        </div>

        {error && <div className="page-error">{error}</div>}

        {/* ── Tab: BI Report Builder ── */}
        {activeTab === 'builder' && (
          <div>
            <ReportBuilder />
            <ScheduledReports />
          </div>
        )}

        {/* ── Tab: Audit Trail ── */}
        {activeTab === 'audit' && (
          <div>
            {isAdmin ? (
              <AuditLog />
            ) : (
              <div className="card" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                <h3 style={{ color: "#6366f1", marginBottom: "10px" }}>Access Restricted</h3>
                <p>Immutable audit trail logs require elevated Administrative credentials to query.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Metrics Overview ── */}
        {activeTab === 'summary' && (
          <div>
            {!summary ? (
              <p className="loading-text">Loading reports...</p>
            ) : (
              <>
                <div
                  className="metric-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <Card title="Employees"><strong>{summary.employees}</strong></Card>
                  <Card title="Present Records"><strong>{summary.presentAttendanceRecords}</strong></Card>
                  <Card title="Pending Leaves"><strong>{summary.pendingLeaves}</strong></Card>
                  <Card title="Payroll Value"><strong>{summary.monthlyPayroll.toLocaleString()} INR</strong></Card>
                  <Card title="Low Stock Items"><strong>{summary.lowStockItems}</strong></Card>
                  <Card title="Open POs"><strong>{summary.openPurchaseOrders}</strong></Card>
                  <Card title="At-Risk Projects"><strong>{summary.atRiskProjects}</strong></Card>
                  <Card title="Unread Alerts"><strong>{summary.unreadNotifications}</strong></Card>
                </div>

                <div className="module-table">
                  <Card title="Finance Breakdown" />
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Transaction Type</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.financeByType.map((item) => (
                          <tr key={item._id}>
                            <td>{item._id}</td>
                            <td>{item.total.toLocaleString()} INR</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default Reports;
