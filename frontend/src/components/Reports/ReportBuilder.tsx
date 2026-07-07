import React, { useState } from "react";
import { toast } from "sonner";
import { getEmployees } from "../../services/hrService";
import { getFinanceTransactions } from "../../services/financeService";
import { getInventoryItems } from "../../services/supplyChainService";
import { getProjects } from "../../services/projectService";
import ReportExport from "./ReportExport";

interface ReportField {
  key: string;
  label: string;
}

const MODULE_FIELDS: Record<string, ReportField[]> = {
  employees: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "department", label: "Department" },
    { key: "joiningDate", label: "Joining Date" },
  ],
  finance: [
    { key: "type", label: "Type" },
    { key: "amount", label: "Amount" },
    { key: "category", label: "Category" },
    { key: "date", label: "Transaction Date" },
    { key: "reference", label: "Reference" },
  ],
  inventory: [
    { key: "name", label: "SKU Name" },
    { key: "stock", label: "Stock Count" },
    { key: "reorderLevel", label: "Reorder Threshold" },
    { key: "unit", label: "Unit" },
  ],
  projects: [
    { key: "name", label: "Project Name" },
    { key: "progress", label: "Progress %" },
    { key: "budget", label: "Total Budget" },
    { key: "actualSpend", label: "Actual Spend" },
    { key: "status", label: "Status" },
  ],
};

export const ReportBuilder: React.FC = () => {
  const [module, setModule] = useState<"employees" | "finance" | "inventory" | "projects">("employees");
  const [selectedFields, setSelectedFields] = useState<string[]>(["name", "email", "role"]);
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as any;
    setModule(val);
    const fields = MODULE_FIELDS[val];
    setSelectedFields(fields.slice(0, 3).map((f) => f.key));
    setFilterField("");
    setFilterValue("");
  };

  const handleFieldToggle = (key: string) => {
    if (selectedFields.includes(key)) {
      if (selectedFields.length > 1) {
        setSelectedFields(selectedFields.filter((f) => f !== key));
      }
    } else {
      setSelectedFields([...selectedFields, key]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      let result: any[] = [];
      if (module === "employees") {
        result = await getEmployees();
      } else if (module === "finance") {
        result = await getFinanceTransactions();
      } else if (module === "inventory") {
        result = await getInventoryItems();
      } else if (module === "projects") {
        result = await getProjects();
      }

      if (filterField && filterValue) {
        result = result.filter((item) => {
          const val = item[filterField];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(filterValue.toLowerCase());
        });
      }

      setData(result);
      toast.success(`Report compiled successfully with ${result.length} records.`);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch module data for report generator.");
      toast.error("Failed to run report schema.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>Custom BI Report Builder</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="form-group">
            <label>1. Select Primary Module</label>
            <select className="form-select" value={module} onChange={handleModuleChange}>
              <option value="employees">HR Workforce Directory</option>
              <option value="finance">Finance General Ledger</option>
              <option value="inventory">SCM Inventory Items</option>
              <option value="projects">Enterprise Projects Node</option>
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div className="form-group">
              <label>2. Filter Column</label>
              <select className="form-select" value={filterField} onChange={(e) => setFilterField(e.target.value)}>
                <option value="">-- No Filter --</option>
                {MODULE_FIELDS[module].map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Filter Query</label>
              <input type="text" className="input" placeholder="Query term..." value={filterValue} onChange={(e) => setFilterValue(e.target.value)} disabled={!filterField} />
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151", display: "block", marginBottom: "8px" }}>
            3. Select Visible Column Fields
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {MODULE_FIELDS[module].map((f) => {
              const active = selectedFields.includes(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => handleFieldToggle(f.key)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    background: active ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "white",
                    color: active ? "white" : "#475569",
                    transition: "all 0.15s ease",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
          <button className="btn" onClick={handleGenerate} disabled={loading} style={{ minHeight: "40px" }}>
            {loading ? "Compiling Data..." : "Run Report Schema"}
          </button>
          
          {data.length > 0 && (
            <ReportExport data={data} filename={`amdox_report_${module}`} />
          )}
        </div>
      </div>

      {error && (
        <div style={{ marginTop: "20px", padding: "12px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "10px", color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
          {error}
        </div>
      )}

      {data.length > 0 && !loading && (
        <div style={{ marginTop: "30px" }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
            Previewing {data.length} records matching schema
          </h4>
          <div className="table-wrapper" style={{ maxHeight: "300px", border: "1px solid #e2e8f0" }}>
            <table className="table">
              <thead>
                <tr>
                  {selectedFields.map((fkey) => (
                    <th key={fkey}>{MODULE_FIELDS[module].find((f) => f.key === fkey)?.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {selectedFields.map((fkey) => {
                      const val = row[fkey];
                      const rendered = val === null || val === undefined ? "-" : typeof val === "object" ? JSON.stringify(val) : String(val);
                      return <td key={fkey}>{rendered}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;
