import express from "express";
import {
  getAttendance,
  addAttendance,
  editAttendance
} from "../../controllers/hr/attendanceController";
import { protect, authorize } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/attendance", protect, authorize("admin", "hr", "manager"), getAttendance);
router.post("/attendance", protect, authorize("admin", "hr"), addAttendance);
router.put("/attendance/:id", protect, authorize("admin", "hr"), editAttendance);

export default router;
