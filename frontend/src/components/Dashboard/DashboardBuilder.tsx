import React, { useState } from "react";
import { FaTrash, FaPlus, FaSave, FaTimes, FaGripVertical, FaUndo } from "react-icons/fa";
import { toast } from "sonner";
import WidgetLibrary from "./WidgetLibrary";

interface WidgetLayoutItem {
  id: string;
  type: string;
  title: string;
  size: "small" | "medium" | "large" | "full";
  order: number;
}

interface DashboardBuilderProps {
  initialLayout: WidgetLayoutItem[];
  onSave: (layout: WidgetLayoutItem[]) => void;
  onCancel: () => void;
}

export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({
  initialLayout,
  onSave,
  onCancel,
}) => {
  const [layout, setLayout] = useState<WidgetLayoutItem[]>(
    [...initialLayout].sort((a, b) => a.order - b.order)
  );
  const [showLibrary, setShowLibrary] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleAddWidget = (type: string, title: string, size: "small" | "medium" | "large" | "full") => {
    const newWidget: WidgetLayoutItem = {
      id: `w-${type}-${Date.now()}`,
      type,
      title,
      size,
      order: layout.length,
    };
    setLayout([...layout, newWidget]);
    setShowLibrary(false);
    toast.success(`Widget "${title}" added to dashboard layout.`);
  };

  const handleDeleteWidget = (id: string) => {
    const widget = layout.find(w => w.id === id);
    setLayout(layout.filter((w) => w.id !== id).map((w, idx) => ({ ...w, order: idx })));
    toast.info(`Widget "${widget?.title || 'Widget'}" removed from layout.`);
  };

  const handleResize = (id: string, newSize: "small" | "medium" | "large" | "full") => {
    setLayout(layout.map((w) => (w.id === id ? { ...w, size: newSize } : w)));
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Set a ghost image or drag data for compatibility
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reordered = [...layout];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    // Reassign order properties
    const updated = reordered.map((widget, idx) => ({
      ...widget,
      order: idx,
    }));

    setLayout(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleResetDefault = () => {
    const defaultLayout: WidgetLayoutItem[] = [
      { id: "w-workforce", type: "workforce", title: "Workforce Size", size: "small", order: 0 },
      { id: "w-payroll", type: "payroll", title: "Monthly Payroll", size: "small", order: 1 },
      { id: "w-lowstock", type: "lowStock", title: "Low Stock Alerts", size: "small", order: 2 },
      { id: "w-openpos", type: "openPOs", title: "Open POs", size: "small", order: 3 },
      { id: "w-projectsrisk", type: "projectsRisk", title: "At-Risk Projects", size: "medium", order: 4 },
      { id: "w-unreadalerts", type: "unreadAlerts", title: "Unread Alerts", size: "medium", order: 5 },
      { id: "w-attendancechart", type: "attendanceChart", title: "Attendance Overview", size: "medium", order: 6 },
      { id: "w-inventorychart", type: "inventoryChart", title: "Supply Chain Stock Levels", size: "large", order: 7 },
      { id: "w-financechart", type: "financeChart", title: "Ledger Allocations", size: "large", order: 8 },
      { id: "w-projectschart", type: "projectsChart", title: "Projects Spend Tracker", size: "full", order: 9 },
    ];
    setLayout(defaultLayout);
    toast.info("Dashboard layout reset to default configurations.");
  };

  const getGridSpanClass = (size: "small" | "medium" | "large" | "full") => {
    if (size === "small") return "span-3";
    if (size === "medium") return "span-4";
    if (size === "large") return "span-6";
    return "span-12";
  };

  const currentWidgetTypes = layout.map((w) => w.type);

  return (
    <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "16px", border: "2px dashed #cbd5e1", marginBottom: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>Customize Workspace Layout</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b", fontWeight: 500 }}>
            Drag and drop widgets to reorder. Adjust width sizes below. Changes persist securely in the cloud.
          </p>
        </div>
        
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn" style={{ background: "#8b5cf6", gap: "6px", minHeight: "38px" }} onClick={handleResetDefault}>
            <FaUndo style={{ marginRight: "4px" }} /> Reset to Default
          </button>
          <button className="btn" style={{ background: "#4f46e5", gap: "6px", minHeight: "38px" }} onClick={() => setShowLibrary(true)}>
            <FaPlus style={{ marginRight: "4px" }} /> Add Widget
          </button>
          <button className="btn" style={{ gap: "6px", minHeight: "38px" }} onClick={() => onSave(layout)}>
            <FaSave style={{ marginRight: "4px" }} /> Save Layout
          </button>
          <button className="btn btn-danger" style={{ gap: "6px", minHeight: "38px" }} onClick={onCancel}>
            <FaTimes style={{ marginRight: "4px" }} /> Cancel
          </button>
        </div>
      </div>

      <div className="bento-grid" style={{ minHeight: "200px" }}>
        {layout.map((widget, index) => {
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;
          const span = getGridSpanClass(widget.size);

          return (
            <div 
              key={widget.id} 
              className={`bento-card ${span}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{ 
                border: isDragOver 
                  ? "2.5px dashed #10b981" 
                  : isDragging 
                    ? "2.5px dashed #cbd5e1" 
                    : "1.5px solid #e2e8f0", 
                boxShadow: isDragging 
                  ? "none" 
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                background: isDragging ? "#f1f5f9" : "white",
                opacity: isDragging ? 0.5 : 1,
                cursor: "grab",
                position: "relative",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
              }}
            >
              {/* Top Row with Drag Handle, Title and Delete */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ color: "#94a3b8", display: "flex", alignItems: "center", cursor: "grab" }}>
                      <FaGripVertical />
                    </div>
                    <div>
                      <span style={{ fontSize: "9px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        WIDGET #{index + 1}
                      </span>
                      <h4 style={{ margin: "2px 0 0 0", fontSize: "14px", fontWeight: 700, color: "#0f172a", wordBreak: "break-word" }}>
                        {widget.title}
                      </h4>
                    </div>
                  </div>
                  
                  <button 
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "4px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWidget(widget.id);
                    }}
                    title="Remove Widget"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Size Controls */}
                <div style={{ marginTop: "18px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#475569", marginBottom: "6px" }}>Width Allocation:</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {(["small", "medium", "large", "full"] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResize(widget.id, sz);
                        }}
                        style={{
                          padding: "5px 10px",
                          fontSize: "10px",
                          fontWeight: 700,
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          cursor: "pointer",
                          background: widget.size === sz ? "#6366f1" : "white",
                          color: widget.size === sz ? "white" : "#475569",
                          transition: "all 0.15s ease",
                          flex: "1 0 auto",
                          textAlign: "center"
                        }}
                      >
                        {sz.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row showing Widget Type details */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "12px", marginTop: "14px", fontSize: "11px", color: "#64748b" }}>
                <span>Type: <code>{widget.type}</code></span>
                <span style={{ fontWeight: 600, color: "#94a3b8" }}>Drag to reorder</span>
              </div>
            </div>
          );
        })}
      </div>

      {showLibrary && (
        <WidgetLibrary
          currentWidgetTypes={currentWidgetTypes}
          onAddWidget={handleAddWidget}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
};

export default DashboardBuilder;
