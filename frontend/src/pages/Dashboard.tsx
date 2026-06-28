import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../layout/Mainlayout";
import { getReportSummary } from "../services/reportService";
import { getInventoryItems } from "../services/supplyChainService";
import { getProjects } from "../services/projectService";
import type { ReportSummary } from "../types/dashboard";
import type { InventoryItem } from "../types/supplyChain";
import type { Project } from "../types/project";
import {
  FaUsers,
  FaMoneyBill,
  FaFileAlt,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaClipboardList,
} from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

const Dashboard = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [summaryData, inventoryData, projectsData] = await Promise.all([
          getReportSummary(),
          getInventoryItems(),
          getProjects()
        ]);
        setSummary(summaryData);
        setInventory(inventoryData);
        setProjects(projectsData);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to fetch real-time dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ padding: "100px 0", textAlign: "center", fontSize: "18px", fontWeight: 600, color: "#64748b" }}>
          Loading real-time enterprise insights...
        </div>
      </MainLayout>
    );
  }

  if (error || !summary) {
    return (
      <MainLayout>
        <div style={{ padding: "40px", textAlign: "center", color: "#dc2626", fontWeight: 600 }}>
          {error || "No dashboard data found"}
        </div>
      </MainLayout>
    );
  }

  // Real Finance chart data mapping from backend aggregation
  const defaultFinanceData = [
    { name: "GL", fullName: "General Ledger" },
    { name: "AP", fullName: "Accounts Payable" },
    { name: "AR", fullName: "Accounts Receivable" },
    { name: "Payment", fullName: "Payments" },
  ];
  const financeChartData = defaultFinanceData.map((def) => {
    const matched = summary.financeByType?.find((item) => item._id === def.name);
    return {
      name: def.fullName,
      amount: matched ? matched.total : 0,
    };
  });

  // Real SCM Inventory Stock Levels
  const inventoryChartData = inventory.map(item => ({
    name: item.name.length > 18 ? `${item.name.substring(0, 15)}...` : item.name,
    stock: item.stock,
    reorderLevel: item.reorderLevel
  }));

  // Real Project progress & spend comparison
  const projectChartData = projects.map(proj => ({
    name: proj.name.length > 20 ? `${proj.name.substring(0, 17)}...` : proj.name,
    progress: proj.progress,
    budget: proj.budget / 10000, // Normalized for display
    actualSpend: proj.actualSpend / 10000
  }));

  // Real Attendance pie chart data
  const present = summary.presentAttendanceRecords || 0;
  const totalEmp = summary.employees || 0;
  const onLeave = summary.pendingLeaves || 0;
  const absent = Math.max(0, totalEmp - present - onLeave);

  const attendancePieData = [
    { name: "Present Today", value: present, color: "#16a34a" },
    { name: "On Leave", value: onLeave, color: "#d97706" },
    { name: "Absent", value: absent, color: "#dc2626" },
  ].filter((item) => item.value > 0);

  return (
    <MainLayout>
      <div className="page-header" style={{ marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#081f53", letterSpacing: "-0.02em" }}>
            Smart Enterprise Dashboard
          </h1>
          <p style={{ color: "#64748b", margin: "6px 0 0 0", fontSize: "14px", fontWeight: 500 }}>
            Real-time multi-tenant monitoring for <strong>{user?.name || "User"}</strong> ({user?.role})
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        
        {/* KPI: Workforce Size (span-3) */}
        <div className="bento-card span-3">
          <div className="bento-header-row">
            <div className="bento-label">Workforce Size</div>
            <div className="bento-icon-wrapper">
              <FaUsers />
            </div>
          </div>
          <div>
            <div className="bento-value">{summary.employees}</div>
            <div className="bento-trend">
              <FaArrowUp /> Active employees
            </div>
          </div>
        </div>

        {/* KPI: Monthly Payroll (span-3) */}
        <div className="bento-card span-3">
          <div className="bento-header-row">
            <div className="bento-label">Monthly Payroll</div>
            <div className="bento-icon-wrapper">
              <FaMoneyBill />
            </div>
          </div>
          <div>
            <div className="bento-value">
              ₹{summary.monthlyPayroll ? summary.monthlyPayroll.toLocaleString() : "0"}
            </div>
            <div className="bento-trend neutral">Ledger aggregate</div>
          </div>
        </div>

        {/* KPI: Low Stock SKU Alert (span-3) */}
        <div className={`bento-card span-3 ${summary.lowStockItems > 0 ? "alert" : "success"}`}>
          <div className="bento-header-row">
            <div className="bento-label">Low Stock Alerts</div>
            <div className="bento-icon-wrapper">
              <MdOutlineInventory />
            </div>
          </div>
          <div>
            <div className="bento-value">{summary.lowStockItems} SKUs</div>
            <div className={`bento-trend ${summary.lowStockItems > 0 ? "down" : ""}`}>
              {summary.lowStockItems > 0 ? (
                <>
                  <FaArrowDown /> Threshold breached
                </>
              ) : (
                "Inventory levels healthy"
              )}
            </div>
          </div>
        </div>

        {/* KPI: Open POs (span-3) */}
        <div className={`bento-card span-3 ${summary.openPurchaseOrders > 0 ? "warning" : ""}`}>
          <div className="bento-header-row">
            <div className="bento-label">Open POs</div>
            <div className="bento-icon-wrapper">
              <FaFileAlt />
            </div>
          </div>
          <div>
            <div className="bento-value">{summary.openPurchaseOrders}</div>
            <div className="bento-trend neutral">Draft & Sent status</div>
          </div>
        </div>

        {/* KPI: At-Risk Projects (span-4) */}
        <div className={`bento-card span-4 ${summary.atRiskProjects > 0 ? "warning" : "success"}`}>
          <div className="bento-header-row">
            <div className="bento-label">At-Risk Projects</div>
            <div className="bento-icon-wrapper">
              <FaClipboardList />
            </div>
          </div>
          <div>
            <div className="bento-value">{summary.atRiskProjects}</div>
            <div className={`bento-trend ${summary.atRiskProjects > 0 ? "down" : ""}`}>
              {summary.atRiskProjects > 0 ? "Schedules delayed" : "All project nodes on schedule"}
            </div>
          </div>
        </div>

        {/* KPI: Notifications (span-4) */}
        <div className={`bento-card span-4 ${summary.unreadNotifications > 0 ? "alert" : ""}`}>
          <div className="bento-header-row">
            <div className="bento-label">Unread Alerts</div>
            <div className="bento-icon-wrapper">
              <FaBell />
            </div>
          </div>
          <div>
            <div className="bento-value">{summary.unreadNotifications}</div>
            <div className="bento-trend neutral">Real-time alerts active</div>
          </div>
        </div>

        {/* Chart: Attendance status (span-4) */}
        <div className="bento-card span-4">
          <div className="bento-chart-header">
            <div className="bento-chart-title">Attendance Overview</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <div className="bento-chart-wrapper" style={{ height: "130px", marginTop: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {attendancePieData.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: item.color }} />
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart: SCM Inventory Stock Levels (span-6) */}
        <div className="bento-card span-6">
          <div className="bento-chart-header">
            <div className="bento-chart-title">Supply Chain Stock Levels</div>
          </div>
          <div className="bento-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                />
                <Legend />
                <Bar dataKey="stock" name="Current Stock" fill="#081f53" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reorderLevel" name="Reorder Point" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Finance Ledger Allocations (span-6) */}
        <div className="bento-card span-6">
          <div className="bento-chart-header">
            <div className="bento-chart-title">Ledger Allocations</div>
          </div>
          <div className="bento-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Total"]}
                  contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                />
                <Legend />
                <Bar dataKey="amount" name="Ledger Balance (INR)" fill="#332e98" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Projects Spend Tracker (span-12) */}
        <div className="bento-card span-12">
          <div className="bento-chart-header">
            <div className="bento-chart-title">Projects Progress and Budget Spend Tracker</div>
          </div>
          <div className="bento-chart-wrapper" style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Progress %") return [`${value}%`, name];
                    return [`₹${(Number(value) * 10000).toLocaleString()}`, name === "Budget" ? "Total Budget" : "Actual Spend"];
                  }}
                  contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                />
                <Legend />
                <Area type="monotone" dataKey="progress" name="Progress %" stroke="#2563eb" fillOpacity={1} fill="url(#colorProgress)" />
                <Area type="monotone" dataKey="actualSpend" name="Actual Spend (in 10k INR)" stroke="#d97706" fillOpacity={1} fill="url(#colorSpend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Dashboard;