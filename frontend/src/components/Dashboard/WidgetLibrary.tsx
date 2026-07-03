import React from "react";
import { FaPlus } from "react-icons/fa";

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
  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal" style={{ width: "600px", maxWidth: "90%", maxHeight: "85vh", display: "flex", flexDirection: "column", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>Widget Library</h2>
          <button className="btn btn-danger" style={{ minHeight: "34px", padding: "0 12px", fontSize: "12px" }} onClick={onClose}>Close</button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", paddingRight: "4px" }}>
          {AVAILABLE_WIDGETS.map((widget) => {
            const isAdded = currentWidgetTypes.includes(widget.type);
            return (
              <div 
                key={widget.type} 
                style={{ 
                  border: "1.5px solid #e2e8f0", 
                  borderRadius: "12px", 
                  padding: "16px", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  background: isAdded ? "#f8fafc" : "white",
                  opacity: isAdded ? 0.75 : 1,
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>{widget.title}</strong>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "#e2e8f0", fontWeight: 700, color: "#475569", textTransform: "capitalize" }}>
                      {widget.size}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 16px 0", lineHeight: "1.4" }}>{widget.desc}</p>
                </div>
                
                <button 
                  className="btn" 
                  disabled={isAdded}
                  style={{ width: "100%", minHeight: "36px", fontSize: "12px", gap: "6px" }}
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
