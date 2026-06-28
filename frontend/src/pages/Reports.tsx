import { useCallback, useEffect, useState } from 'react';
import MainLayout from '../layout/Mainlayout';
import Card from '../components/common/Card';
import type { ReportSummary } from '../types/dashboard';
import { getReportSummary } from '../services/reportService';

function Reports() {
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

  return (
    <MainLayout>
      <div className="module-page">
        <div className="page-header"><h1>Business Intelligence</h1></div>
        {error && <div className="page-error">{error}</div>}
        {!summary ? <p className="loading-text">Loading reports...</p> : (
          <>
            <div className="metric-grid">
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
                  <thead><tr><th>Transaction Type</th><th>Total Amount</th></tr></thead>
                  <tbody>
                    {summary.financeByType.map((item) => (
                      <tr key={item._id}><td>{item._id}</td><td>{item.total.toLocaleString()} INR</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Reports;
