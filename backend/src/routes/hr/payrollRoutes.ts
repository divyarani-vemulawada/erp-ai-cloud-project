import express from "express";
import {
  getPayroll,
  addPayroll,
  editPayroll,
  removePayroll
} from "../../controllers/hr/payrollController";
import { protect, authorize } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/payroll", protect, authorize("admin", "hr", "finance"), getPayroll);
router.post("/payroll", protect, authorize("admin", "hr"), addPayroll);
router.put("/payroll/:id", protect, authorize("admin", "hr"), editPayroll);
router.delete("/payroll/:id", protect, authorize("admin"), removePayroll);

export default router;
