import React from "react";
import { FaPlus } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

interface WidgetLibraryProps {
  onAddWidget: (type: string, title: string, size: "small" | "medium" | "large" | "full") => void;
  onClose: () => void;
  currentWidgetTypes: string[];
}

const AVAILABLE_WIDGETS = [
  { type: "workforce", title: "Workforce Size", size: "small" as const, desc: "Total active employees count" },
  { type: "payroll", title: "Monthly Payroll", size: "small" as const, desc: "Sum of monthly employee net salary payouts" },
  { type: "lowStock", title: "Low Stock SKU Alert", size: "small" as const, desc: "SKU counts below reorder points" },
  { type: "openPOs", title: "Open Purchase Orders", size: "small" as const, desc: "Current open draft/sent vendor orders" },
  { type: "projectsRisk", title: "At-Risk Projects", size: "medium" as const, desc: "Delayed projects exceeding timeline schedule" },
  { type: "unreadAlerts", title: "Unread Notifications", size: "medium" as const, desc: "Important user alert message alerts" },
  { type: "attendanceChart", title: "Attendance Pie Chart", size: "medium" as const, desc: "Present, Leave and Absent breakdown" },
  { type: "inventoryChart", title: "SCM Inventory Bar Chart", size: "large" as const, desc: "Current stock level vs reorder thresholds" },
  { type: "financeChart", title: "Ledger Bar Chart", size: "large" as const, desc: "Ledger transaction type balance totals" },
  { type: "projectsChart", title: "Project Progress Area Chart", size: "full" as const, desc: "Cumulative progress vs actual budget spend" },
  { type: "heatmap", title: "Resource Utilization Heatmap", size: "medium" as const, desc: "Weekly resource allocation hour matrix" },
];

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({
  onAddWidget,
  onClose,
  currentWidgetTypes,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Dynamic Theme Colors
  const titleColor = isDark ? "#ffffff" : "#0f172a";
  const textColor = isDark ? "#8a8f9b" : "#64748b";
  const badgeBg = isDark ? "#18191b" : "#e2e8f0";
  const badgeColor = isDark ? "#ffffff" : "#475569";
  const libraryCardBg = (isAdded: boolean) => 
    isAdded 
      ? (isDark ? "#18191b" : "#f8fafc") 
      : (isDark ? "#0f1012" : "white");
  const cardBorder = isDark ? "1.5px solid #232529" : "1.5px solid #e2e8f0";

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal" style={{ width: "600px", maxWidth: "90%", maxHeight: "85vh", display: "flex", flexDirection: "column", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: titleColor }}>Widget Library</h2>
          <button className="btn btn-danger" style={{ minHeight: "34px", padding: "0 12px", fontSize: "12px" }} onClick={onClose}>Close</button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingRight: "4px" }}>
          {AVAILABLE_WIDGETS.map((widget) => {
            const isAdded = currentWidgetTypes.includes(widget.type);
            return (
              <div 
                key={widget.type} 
                style={{ 
                  border: cardBorder, 
                  borderRadius: "12px", 
                  padding: "16px", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  background: libraryCardBg(isAdded),
                  opacity: isAdded ? 0.75 : 1,
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "14px", color: titleColor }}>{widget.title}</strong>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: badgeBg, fontWeight: 700, color: badgeColor, textTransform: "capitalize" }}>
                      {widget.size}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: textColor, margin: "0 0 16px 0", lineHeight: "1.4" }}>{widget.desc}</p>
                </div>
                
                <button 
                  className="btn" 
                  disabled={isAdded}
                  style={{
                    width: "100%",
                    minHeight: "36px",
                    fontSize: "12px",
                    gap: "6px",
                    background: isAdded ? (isDark ? "#1c1e22" : "#e2e8f0") : (isDark ? "#ffffff" : "#6366f1"),
                    color: isAdded ? (isDark ? "#5a5f6c" : "#94a3b8") : (isDark ? "#131417" : "white"),
                    border: isDark && !isAdded ? "none" : "1px solid transparent"
                  }}
                  onClick={() => onAddWidget(widget.type, widget.title, widget.size)}
                >
                  <FaPlus /> {isAdded ? "Added to Dashboard" : "Add Widget"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WidgetLibrary;
