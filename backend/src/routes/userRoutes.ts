import express, { Request, Response } from "express";
import User from "../models/User";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/userController";

import {
  protect,
  authorize
} from "../middleware/authMiddleware";

const router = express.Router();

// Profile update - using /me to avoid /:id conflict
router.put("/me", protect, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = (req as any).user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { returnDocument: 'after' }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, getUserById);
router.post("/", protect, authorize("admin"), createUser);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;