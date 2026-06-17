import express from "express";

import {
  login,
  register,
   getProfile,
   changePassword
} from "../controllers/authController";
import { protect ,authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);

router.post("/login",login);

router.get( "/profile", protect, getProfile );

router.put( "/change-password", protect, changePassword);



export default router;