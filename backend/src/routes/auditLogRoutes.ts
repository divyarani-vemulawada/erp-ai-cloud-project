import express from "express";
import AuditLog from "../models/AuditLog";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, authorize("admin"), async (req: any, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (req.query.email) {
      query.email = { $regex: req.query.email as string, $options: "i" };
    }
    if (req.query.action) {
      query.action = { $regex: req.query.action as string, $options: "i" };
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      logs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
