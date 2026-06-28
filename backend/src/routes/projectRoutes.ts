import express from "express";
import Project from "../models/Project";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, authorize("admin", "hr", "manager"), async (_req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

router.post("/", protect, authorize("admin", "manager"), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ message: "Project created", project });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", protect, authorize("admin", "manager"), async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project updated", project });
});

router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted" });
});

export default router;
