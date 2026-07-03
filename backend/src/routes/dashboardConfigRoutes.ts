import express from "express";
import DashboardConfig, { IWidgetConfig } from "../models/DashboardConfig";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

const defaultLayout: IWidgetConfig[] = [
  { id: "w-workforce", type: "workforce", title: "Workforce Size", size: "small", order: 0 },
  { id: "w-payroll", type: "payroll", title: "Monthly Payroll", size: "small", order: 1 },
  { id: "w-lowstock", type: "lowStock", title: "Low Stock Alerts", size: "small", order: 2 },
  { id: "w-openpos", type: "openPOs", title: "Open POs", size: "small", order: 3 },
  { id: "w-projectsrisk", type: "projectsRisk", title: "At-Risk Projects", size: "medium", order: 4 },
  { id: "w-unreadalerts", type: "unreadAlerts", title: "Unread Alerts", size: "medium", order: 5 },
  { id: "w-attendancechart", type: "attendanceChart", title: "Attendance Overview", size: "medium", order: 6 },
  { id: "w-inventorychart", type: "inventoryChart", title: "Supply Chain Stock Levels", size: "large", order: 7 },
  { id: "w-financechart", type: "financeChart", title: "Ledger Allocations", size: "large", order: 8 },
  { id: "w-projectschart", type: "projectsChart", title: "Projects Spend Tracker", size: "full", order: 9 },
];

router.get("/config", protect, async (req: any, res) => {
  try {
    let config = await DashboardConfig.findOne({ userId: req.user.id });
    if (!config) {
      config = await DashboardConfig.create({
        userId: req.user.id,
        layout: defaultLayout,
      });
    }
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/config", protect, async (req: any, res) => {
  try {
    const { layout } = req.body;
    let config = await DashboardConfig.findOne({ userId: req.user.id });
    if (!config) {
      config = new DashboardConfig({ userId: req.user.id, layout });
    } else {
      config.layout = layout;
    }
    await config.save();
    res.json({ message: "Dashboard layout updated successfully", config });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
