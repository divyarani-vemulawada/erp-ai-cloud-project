import express from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  removeEmployee,
  getLeaveRequests,
  addLeaveRequest,
  changeLeaveStatus,
  getAttendance,
  addAttendance,
  editAttendance,
  getPayroll,
  addPayroll,
  editPayroll,
  removePayroll
} from "../controllers/hrController";
import { protect, authorize } from "../middleware/authMiddleware";
import Employee from "../models/Employee";

const router = express.Router();

// Search route
router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const results = await Employee.find({
      $or: [
        { fullName: { $regex: String(q), $options: "i" } },
        { employeeId: { $regex: String(q), $options: "i" } },
        { department: { $regex: String(q), $options: "i" } },
        { designation: { $regex: String(q), $options: "i" } },
      ]
    } as any).limit(5);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

// Employee routes
router.get("/employees", protect, authorize("admin", "hr", "manager"), getEmployees);
router.post("/employees", protect, authorize("admin", "hr"), addEmployee);
router.get("/employees/:id", protect, authorize("admin", "hr", "manager"), getEmployee);
router.put("/employees/:id", protect, authorize("admin", "hr"), editEmployee);
router.delete("/employees/:id", protect, authorize("admin"), removeEmployee);

// Leave routes
router.get("/leave", protect, authorize("admin", "hr", "manager"), getLeaveRequests);
router.post("/leave", protect, authorize("admin", "hr", "manager", "employee"), addLeaveRequest);
router.put("/leave/:id/status", protect, authorize("admin", "hr"), changeLeaveStatus);

// Attendance routes
router.get("/attendance", protect, authorize("admin", "hr", "manager"), getAttendance);
router.post("/attendance", protect, authorize("admin", "hr"), addAttendance);
router.put("/attendance/:id", protect, authorize("admin", "hr"), editAttendance);

// Payroll routes
router.get("/payroll", protect, authorize("admin", "hr", "finance"), getPayroll);
router.post("/payroll", protect, authorize("admin", "hr"), addPayroll);
router.put("/payroll/:id", protect, authorize("admin", "hr"), editPayroll);
router.delete("/payroll/:id", protect, authorize("admin"), removePayroll);

export default router;