import express from "express";
import {
  getLeaveRequests,
  addLeaveRequest,
  changeLeaveStatus
} from "../../controllers/hr/leaveController";
import { protect, authorize } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/leave", protect, authorize("admin", "hr", "manager"), getLeaveRequests);
router.post("/leave", protect, authorize("admin", "hr", "manager", "employee"), addLeaveRequest);
router.put("/leave/:id/status", protect, authorize("admin", "hr"), changeLeaveStatus);

export default router;
