import React from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

interface PieChartProps {
  data: { name: string; value: number; color?: string }[];
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#4f46e5", "#818cf8"];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
  height = 300,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const tooltipBg = isDark ? "#131417" : "white";
  const tooltipBorder = isDark ? "#232529" : "#e2e8f0";
  const tooltipColor = isDark ? "#ffffff" : "#1e293b";

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", fontSize: "12px", color: tooltipColor }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
