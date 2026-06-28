import express from "express";
import {
  getPayslips,
  getPayslip,
  getEmployeePayslips,
  addPayslip,
  removePayslip
} from "../../controllers/hr/payslipController";
import { protect, authorize } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/payslips", protect, authorize("admin", "hr", "finance"), getPayslips);
router.post("/payslips", protect, authorize("admin", "hr"), addPayslip);

// /payslips/employee/:employeeId must be registered before /payslips/:id
// so Express does not match the literal "employee" as the :id segment
router.get("/payslips/employee/:employeeId", protect, authorize("admin", "hr", "finance"), getEmployeePayslips);
router.get("/payslips/:id", protect, authorize("admin", "hr", "finance"), getPayslip);
router.delete("/payslips/:id", protect, authorize("admin", "hr"), removePayslip);

export default router;
