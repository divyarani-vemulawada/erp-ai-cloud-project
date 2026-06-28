import express from "express";
import Employee from "../models/Employee";
import Attendance from "../models/Attendance";
import LeaveRequest from "../models/LeaveRequest";
import Payroll from "../models/Payroll";
import FinanceTransaction from "../models/FinanceTransaction";
import InventoryItem from "../models/InventoryItem";
import PurchaseOrder from "../models/PurchaseOrder";
import Project from "../models/Project";
import Notification from "../models/Notification";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/summary", protect, authorize("admin", "manager", "finance", "hr"), async (_req, res) => {
  const [
    employees,
    attendance,
    leaves,
    payroll,
    finance,
    inventory,
    purchaseOrders,
    projects,
    unreadNotifications,
  ] = await Promise.all([
    Employee.countDocuments(),
    Attendance.countDocuments({ status: "Present" }),
    LeaveRequest.countDocuments({ status: "Pending" }),
    Payroll.aggregate([{ $group: { _id: null, total: { $sum: "$netSalary" } } }]),
    FinanceTransaction.aggregate([{ $group: { _id: "$type", total: { $sum: "$amount" } } }]),
    InventoryItem.countDocuments({ status: { $in: ["Low Stock", "Out of Stock"] } }),
    PurchaseOrder.countDocuments({ status: { $in: ["Draft", "Sent"] } }),
    Project.countDocuments({ status: "At Risk" }),
    Notification.countDocuments({ status: "Unread" }),
  ]);

  res.json({
    employees,
    presentAttendanceRecords: attendance,
    pendingLeaves: leaves,
    monthlyPayroll: payroll[0]?.total ?? 0,
    financeByType: finance,
    lowStockItems: inventory,
    openPurchaseOrders: purchaseOrders,
    atRiskProjects: projects,
    unreadNotifications,
  });
});

export default router;
