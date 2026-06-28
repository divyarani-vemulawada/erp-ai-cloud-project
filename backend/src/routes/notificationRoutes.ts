import express from "express";
import Notification from "../models/Notification";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, async (_req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json(notifications);
});

router.post("/", protect, authorize("admin", "manager", "hr"), async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ message: "Notification created", notification });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id/read", protect, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { status: "Read" },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json({ message: "Notification marked read", notification });
});

export default router;
