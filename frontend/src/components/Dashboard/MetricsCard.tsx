import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trendText?: string;
  trendDirection?: "up" | "down" | "neutral";
  variant?: "info" | "success" | "warning" | "danger" | "default" | "gradient";
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  trendText,
  trendDirection = "neutral",
  variant = "default",
}) => {
  const getTrendIcon = () => {
    if (trendDirection === "up") return <FaArrowUp style={{ marginRight: "4px" }} />;
    if (trendDirection === "down") return <FaArrowDown style={{ marginRight: "4px" }} />;
    return null;
  };

  const getTrendClass = () => {
    if (trendDirection === "up") return "bento-trend";
    if (trendDirection === "down") return "bento-trend down";
    return "bento-trend neutral";
  };

  const getVariantClass = () => {
    if (variant === "danger") return "alert"; // Map danger to CSS class "alert"
    if (variant === "default") return "";
    return variant; // warning, success, etc.
  };

  return (
    <div className={`bento-card ${getVariantClass()}`}>
      <div className="bento-header-row">
        <div className="bento-label">{title}</div>
        {icon && <div className="bento-icon-wrapper">{icon}</div>}
      </div>
      <div>
        <div className="bento-value">{value}</div>
        {trendText && (
          <div className={getTrendClass()}>
            {getTrendIcon()}
            {trendText}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
