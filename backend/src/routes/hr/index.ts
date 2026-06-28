import express from "express";
import employeeRoutes from "./employeeRoutes";
import leaveRoutes from "./leaveRoutes";
import attendanceRoutes from "./attendanceRoutes";
import payrollRoutes from "./payrollRoutes";

const router = express.Router();

router.use("/", employeeRoutes);
router.use("/", leaveRoutes);
router.use("/", attendanceRoutes);
router.use("/", payrollRoutes);

export default router;
