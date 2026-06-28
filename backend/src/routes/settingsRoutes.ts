import express from "express";
import TenantSetting from "../models/TenantSetting";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, authorize("admin"), async (_req, res) => {
  let settings = await TenantSetting.findOne();
  if (!settings) settings = await TenantSetting.create({});
  res.json(settings);
});

router.put("/", protect, authorize("admin"), async (req, res) => {
  let settings = await TenantSetting.findOne();
  if (!settings) {
    settings = await TenantSetting.create(req.body);
  } else {
    settings.set(req.body);
    await settings.save();
  }
  res.json({ message: "Settings updated", settings });
});

export default router;
