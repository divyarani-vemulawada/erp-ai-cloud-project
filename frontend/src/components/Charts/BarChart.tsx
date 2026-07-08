import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  yName?: string;
  color?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  yName = "Amount",
  color = "#332e98",
  height = 300,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gridStroke = isDark ? "#232529" : "#f1f5f9";
  const axisStroke = isDark ? "#5a5f6c" : "#94a3b8";
  const tooltipBg = isDark ? "#131417" : "white";
  const tooltipBorder = isDark ? "#232529" : "#e2e8f0";
  const tooltipColor = isDark ? "#ffffff" : "#1e293b";

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey={xKey} stroke={axisStroke} fontSize={11} />
          <YAxis stroke={axisStroke} fontSize={11} />
          <Tooltip
            contentStyle={{ background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: "8px", fontSize: "12px", color: tooltipColor }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey={yKey} name={yName} fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
