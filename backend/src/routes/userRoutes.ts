import express from "express";

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

router.get( "/", protect, authorize("admin"), getAllUsers);

router.get( "/:id", protect, getUserById );

router.post( "/", protect, authorize("admin"), createUser);

router.put( "/:id", protect, authorize("admin"), updateUser );

router.delete( "/:id", protect, authorize("admin"), deleteUser );

export default router;