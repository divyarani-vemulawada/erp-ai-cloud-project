import { Request, Response, NextFunction } from "express";
import AuditLog from "../models/AuditLog";

export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only audit mutating requests
  if (!["POST", "PUT", "DELETE"].includes(req.method)) {
    return next();
  }

  // Intercept the response finish event to log successful operations
  res.on("finish", async () => {
    if (res.statusCode >= 400) return; // Only log successful mutations

    const user = (req as any).user;
    if (!user) return; // Unauthenticated actions (like registration or login)

    let action = `${req.method} ${req.path}`;
    const url = req.baseUrl || req.originalUrl || req.path;

    if (url.includes("/hr/employees")) {
      action = req.method === "POST" ? "Create Employee" : req.method === "PUT" ? "Update Employee" : "Delete Employee";
    } else if (url.includes("/hr/attendance")) {
      action = "Update Attendance Record";
    } else if (url.includes("/hr/leave")) {
      action = req.method === "POST" ? "Submit Leave Request" : "Update Leave Request Status";
    } else if (url.includes("/hr/payroll")) {
      action = "Process Payroll Run";
    } else if (url.includes("/finance/transactions")) {
      action = req.method === "POST" ? "Create Ledger Transaction" : req.method === "PUT" ? "Update Ledger Transaction" : "Delete Ledger Transaction";
    } else if (url.includes("/settings")) {
      action = "Update Tenant Settings";
    } else if (url.includes("/projects")) {
      action = req.method === "POST" ? "Create Project node" : req.method === "PUT" ? "Update Project node" : "Delete Project node";
    } else if (url.includes("/supply-chain")) {
      action = req.method === "POST" ? "Create SCM Inventory Item" : "Update SCM Inventory Item";
    } else if (url.includes("/dashboard/config")) {
      action = "Update Dashboard Layout";
    }

    try {
      // Exclude passwords or sensitive auth info from details if present
      const cleanBody = { ...req.body };
      if (cleanBody.password) delete cleanBody.password;
      if (cleanBody.token) delete cleanBody.token;

      await AuditLog.create({
        userId: user.id || user._id,
        email: user.email,
        role: user.role || "user",
        action,
        method: req.method,
        path: req.originalUrl || req.url,
        details: JSON.stringify(cleanBody),
        ip: req.ip || req.socket.remoteAddress || "",
      });
    } catch (err) {
      console.error("Failed to write audit log:", err);
    }
  });

  next();
};
