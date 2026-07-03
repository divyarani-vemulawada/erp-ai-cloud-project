import React from "react";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";

interface ReportExportProps {
  data: any[];
  filename: string;
  disabled?: boolean;
}

export const ReportExport: React.FC<ReportExportProps> = ({
  data,
  filename,
  disabled = false,
}) => {
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    // Filter out internal mongoose properties if present
    const cleanData = data.map((item) => {
      const copy = { ...item };
      delete copy._id;
      delete copy.__v;
      delete copy.createdAt;
      delete copy.updatedAt;
      return copy;
    });

    const headers = Object.keys(cleanData[0]);
    const csvRows = [
      headers.join(","), // header row
      ...cleanData.map((row) =>
        headers
          .map((fieldName) => {
            const val = row[fieldName];
            const strVal = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
            return `"${strVal.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        className="btn"
        onClick={handleExportCSV}
        disabled={disabled || data.length === 0}
        style={{ minHeight: "36px", padding: "0 14px", fontSize: "13px", gap: "6px" }}
      >
        <FaFileCsv /> Export CSV
      </button>
      <button
        className="btn"
        onClick={handlePrintPDF}
        disabled={disabled || data.length === 0}
        style={{ minHeight: "36px", padding: "0 14px", fontSize: "13px", gap: "6px", background: "#0a1628" }}
      >
        <FaFilePdf /> Export PDF
      </button>
    </div>
  );
};

export default ReportExport;
