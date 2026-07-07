import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MainLayout from "../layout/Mainlayout";
import { toast } from "sonner";
import { getReportSummary } from "../services/reportService";
import { getInventoryItems } from "../services/supplyChainService";
import { getProjects } from "../services/projectService";
import { getDashboardConfig, saveDashboardConfig } from "../services/dashboardService";
import type { WidgetLayoutItem } from "../services/dashboardService";
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
  FaEdit,
} from "react-icons/fa";
import { MdOutlineInventory } from "react-icons/md";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BarChart } from "../components/Charts/BarChart";
import { PieChart } from "../components/Charts/PieChart";
import { HeatmapChart } from "../components/Charts/HeatmapChart";
import MetricsCard from "../components/Dashboard/MetricsCard";
import DashboardBuilder from "../components/Dashboard/DashboardBuilder";

function Dashboard() {
  const auth = useContext(AuthContext);
  const user = auth?.user;

  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [layout, setLayout] = useState<WidgetLayoutItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, inv, proj, cfg] = await Promise.all([
          getReportSummary(),
          getInventoryItems(),
          getProjects(),
          getDashboardConfig(),
        ]);
        setSummary(s);
        setInventory(inv);
        setProjects(proj);
        setLayout(cfg?.layout ?? []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };
    fetchAll();
  }, []);

  const handleSaveLayout = async (newLayout: WidgetLayoutItem[]) => {
    try {
      await saveDashboardConfig(newLayout);
      setLayout(newLayout);
      setIsEditing(false);
      toast.success("Dashboard layout saved successfully!");
    } catch (err) {
      console.error("Failed to save layout:", err);
      toast.error("Failed to save dashboard layout configuration.");
    }
  };

  // Chart data derived from live data
  const inventoryChartData = inventory.slice(0, 6).map((item) => ({
    name: item.name.length > 12 ? item.name.slice(0, 12) + "…" : item.name,
    stock: item.stock,
  }));

  const financeChartData = summary?.financeByType?.slice(0, 6).map((f) => ({
    name: f._id,
    amount: f.total,
  })) || [];

  const projectChartData = projects.slice(0, 5).map((p) => ({
    name: p.name.length > 10 ? p.name.slice(0, 10) + "…" : p.name,
    progress: p.progress ?? 0,
    budget: p.budget ? p.budget / 10000 : 0,
    actualSpend: p.actualSpend ? p.actualSpend / 10000 : 0,
  }));

  const totalEmp = summary?.employees ?? 0;
  const present = summary?.presentAttendanceRecords ?? 0;
  const onLeave = summary?.pendingLeaves ?? 0;
  const absent = Math.max(0, totalEmp - present - onLeave);

  const attendancePieData = [
    { name: "Present Today", value: present, color: "#10b981" },
    { name: "On Leave", value: onLeave, color: "#f59e0b" },
    { name: "Absent", value: absent, color: "#ef4444" },
  ].filter((item) => item.value > 0);

  const getGridSpanClass = (size: "small" | "medium" | "large" | "full") => {
    switch (size) {
      case "small": return "span-3";
      case "medium": return "span-6";
      case "large": return "span-8";
      case "full": return "span-12";
      default: return "span-4";
    }
  };

  const renderWidget = (widget: WidgetLayoutItem) => {
    const span = getGridSpanClass(widget.size);
    switch (widget.type) {
      case "workforce":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Workforce Size"
              value={summary?.employees ?? "—"}
              icon={<FaUsers />}
              trendText="+2 this month"
              trendDirection="up"
              variant="gradient"
            />
          </div>
        );
      case "payroll":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Monthly Payroll"
              value={summary ? `₹${(summary.monthlyPayroll / 1000).toFixed(0)}K` : "—"}
              icon={<FaMoneyBill />}
              trendText="Current cycle"
              trendDirection="neutral"
            />
          </div>
        );
      case "leaves":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Pending Leaves"
              value={summary?.pendingLeaves ?? "—"}
              icon={<FaClipboardList />}
              trendText="Needs approval"
              trendDirection={summary && summary.pendingLeaves > 5 ? "down" : "neutral"}
              variant={summary && summary.pendingLeaves > 5 ? "warning" : "default"}
            />
          </div>
        );
      case "alerts":
      case "unreadAlerts":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Unread Alerts"
              value={summary?.unreadNotifications ?? "—"}
              icon={<FaBell />}
              trendText="System notifications"
              trendDirection={summary && summary.unreadNotifications > 0 ? "down" : "neutral"}
              variant={summary && summary.unreadNotifications > 0 ? "danger" : "default"}
            />
          </div>
        );
      case "lowstock":
      case "lowStock":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Low Stock Items"
              value={summary?.lowStockItems ?? "—"}
              icon={<MdOutlineInventory />}
              trendText="Requires reorder"
              trendDirection={summary && summary.lowStockItems > 3 ? "down" : "up"}
              variant={summary && summary.lowStockItems > 3 ? "danger" : "success"}
            />
          </div>
        );
      case "openpos":
      case "openPOs":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Open Purchase Orders"
              value={summary?.openPurchaseOrders ?? "—"}
              icon={<FaFileAlt />}
              trendText="Awaiting fulfillment"
              trendDirection="neutral"
            />
          </div>
        );
      case "atrisk":
      case "projectsRisk":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="At-Risk Projects"
              value={summary?.atRiskProjects ?? "—"}
              icon={<FaArrowDown />}
              trendText="Behind schedule"
              trendDirection={summary && summary.atRiskProjects > 0 ? "down" : "up"}
              variant={summary && summary.atRiskProjects > 0 ? "danger" : "success"}
            />
          </div>
        );
      case "presentrecords":
        return (
          <div key={widget.id} className={span}>
            <MetricsCard
              title="Present Records"
              value={summary?.presentAttendanceRecords ?? "—"}
              icon={<FaArrowUp />}
              trendText="Attendance logged"
              trendDirection="up"
              variant="success"
            />
          </div>
        );
      case "inventoryChart":
        return (
          <div key={widget.id} className={`bento-card ${span}`}>
            <div className="bento-chart-header">
              <div className="bento-chart-title">{widget.title}</div>
            </div>
            <BarChart data={inventoryChartData} xKey="name" yKey="stock" yName="Current Stock" color="#6366f1" height={220} />
          </div>
        );
      case "financeChart":
        return (
          <div key={widget.id} className={`bento-card ${span}`}>
            <div className="bento-chart-header">
              <div className="bento-chart-title">{widget.title}</div>
            </div>
            <BarChart data={financeChartData} xKey="name" yKey="amount" yName="Ledger Balance (INR)" color="#8b5cf6" height={220} />
          </div>
        );
      case "attendancePie":
      case "attendanceChart":
        return (
          <div key={widget.id} className={`bento-card ${span}`}>
            <div className="bento-chart-header">
              <div className="bento-chart-title">{widget.title}</div>
            </div>
            <PieChart data={attendancePieData} colors={attendancePieData.map((d) => d.color)} height={220} />
          </div>
        );
      case "projectsChart":
        return (
          <div key={widget.id} className={`bento-card ${span}`}>
            <div className="bento-chart-header">
              <div className="bento-chart-title">{widget.title}</div>
            </div>
            <div className="bento-chart-wrapper" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
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
                  <Area type="monotone" dataKey="progress" name="Progress %" stroke="#6366f1" fillOpacity={1} fill="url(#colorProgress)" />
                  <Area type="monotone" dataKey="actualSpend" name="Actual Spend (in 10k INR)" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case "heatmap":
        return (
          <div key={widget.id} className={`bento-card ${span}`}>
            <div className="bento-chart-header">
              <div className="bento-chart-title">{widget.title}</div>
            </div>
            <HeatmapChart title="" />
          </div>
        );
      default:
        return null;
    }
  };

  if (isEditing) {
    return (
      <MainLayout>
        <div className="page-content">
          <DashboardBuilder
            initialLayout={layout}
            onSave={handleSaveLayout}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-content">
        <div className="page-header" style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#6366f1", letterSpacing: "-0.02em" }}>
              Dashboard
            </h1>
            <p style={{ color: "#64748b", margin: "6px 0 0 0", fontSize: "14px", fontWeight: 500 }}>
              Real-time multi-tenant monitoring for <strong>{user?.name || "User"}</strong> ({user?.role})
            </p>
          </div>

          <button
            className="btn"
            style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "38px" }}
            onClick={() => setIsEditing(true)}
          >
            <FaEdit style={{ marginRight: "4px" }} /> Customize Layout
          </button>
        </div>

        {!summary ? (
          <p className="loading-text">Loading dashboard data…</p>
        ) : (
          <div className="bento-grid">
            {(layout ?? []).length > 0
              ? layout.map((widget) => renderWidget(widget))
              : (
                <div className="bento-card span-12" style={{ textAlign: "center", padding: "48px" }}>
                  <p style={{ color: "#94a3b8", fontSize: "16px" }}>No widgets configured. Click <strong>Customize Layout</strong> to add some!</p>
                </div>
              )
            }
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default Dashboard;