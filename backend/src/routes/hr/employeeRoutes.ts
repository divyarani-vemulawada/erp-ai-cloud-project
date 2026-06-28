import express from "express";
import {
  getEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  removeEmployee
} from "../../controllers/hr/employeeController";
import { protect, authorize } from "../../middleware/authMiddleware";
import Employee from "../../models/hr/Employee";

const router = express.Router();

router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const results = await Employee.find({
      $or: [
        { fullName: { $regex: String(q), $options: "i" } },
        { employeeId: { $regex: String(q), $options: "i" } },
        { department: { $regex: String(q), $options: "i" } },
        { designation: { $regex: String(q), $options: "i" } },
      ]
    } as any).limit(5);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
  }
});

router.get("/employees", protect, authorize("admin", "hr", "manager"), getEmployees);
router.post("/employees", protect, authorize("admin", "hr"), addEmployee);
router.get("/employees/:id", protect, authorize("admin", "hr", "manager"), getEmployee);
router.put("/employees/:id", protect, authorize("admin", "hr"), editEmployee);
router.delete("/employees/:id", protect, authorize("admin"), removeEmployee);

export default router;
