import React, { useState } from "react";

interface HeatmapChartProps {
  title?: string;
  height?: number;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
  title = "Resource Utilization / Activity Heatmap",
}) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["08 AM", "10 AM", "12 PM", "02 PM", "04 PM", "06 PM", "08 PM"];

  // Mock activity levels (0 to 100)
  const generateMockGrid = () => {
    const grid: number[][] = [];
    for (let d = 0; d < 7; d++) {
      const row: number[] = [];
      for (let h = 0; h < 7; h++) {
        const base = (d > 0 && d < 5) ? 40 : 10;
        const hourFactor = (h > 1 && h < 5) ? 45 : 15;
        row.push(Math.min(100, Math.floor(base + hourFactor + Math.random() * 20)));
      }
      grid.push(row);
    }
    return grid;
  };

  const [gridData] = useState<number[][]>(generateMockGrid());
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: string; val: number } | null>(null);

  const getBgColor = (val: number) => {
    if (val < 25) return "rgba(99, 102, 241, 0.15)";
    if (val < 50) return "rgba(99, 102, 241, 0.4)";
    if (val < 75) return "rgba(99, 102, 241, 0.65)";
    return "rgba(99, 102, 241, 0.9)";
  };

  return (
    <div style={{ padding: "10px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", alignItems: "center" }}>
        <h4 style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>{title}</h4>
        {hoveredCell && (
          <div style={{ fontSize: "11px", color: "#1e293b", fontWeight: 700, background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" }}>
            {hoveredCell.day} at {hoveredCell.hour} &rarr; <strong>{hoveredCell.val}% Utilized</strong>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        {/* Day labels column */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "160px", padding: "4px 0", fontSize: "11px", fontWeight: 700, color: "#64748b", width: "30px" }}>
          {days.map((day) => (
            <div key={day} style={{ textAlign: "right", paddingRight: "6px" }}>{day}</div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {gridData.map((row, dIndex) => (
            <div key={dIndex} style={{ display: "flex", gap: "4px", height: "20px" }}>
              {row.map((val, hIndex) => (
                <div
                   key={hIndex}
                   onMouseEnter={() => setHoveredCell({ day: days[dIndex], hour: hours[hIndex], val })}
                   onMouseLeave={() => setHoveredCell(null)}
                   style={{
                     flex: 1,
                     backgroundColor: getBgColor(val),
                     borderRadius: "4px",
                     cursor: "pointer",
                     transition: "all 0.15s ease",
                     border: hoveredCell?.day === days[dIndex] && hoveredCell?.hour === hours[hIndex] ? "1.5px solid #0f172a" : "none",
                   }}
                />
              ))}
            </div>
          ))}

          {/* Hour labels row */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
            {hours.map((hour) => (
              <div key={hour} style={{ flex: 1, textAlign: "center" }}>{hour}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapChart;
