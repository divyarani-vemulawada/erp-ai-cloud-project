import express from "express";
import employeeRoutes from "./employeeRoutes";
import leaveRoutes from "./leaveRoutes";
import attendanceRoutes from "./attendanceRoutes";
import payrollRoutes from "./payrollRoutes";
import payslipRoutes from "./payslipRoutes";
import organisationRoutes from "./organisationRoutes";

const router = express.Router();

router.use("/", employeeRoutes);
router.use("/", leaveRoutes);
router.use("/", attendanceRoutes);
router.use("/", payrollRoutes);
router.use("/", payslipRoutes);
router.use("/", organisationRoutes);

export default router;
