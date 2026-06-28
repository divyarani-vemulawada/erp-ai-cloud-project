import express from "express";
import { getOrganisation } from "../../controllers/hr/organisationController";
import { protect, authorize } from "../../middleware/authMiddleware";

const router = express.Router();

router.get("/organisation", protect, authorize("admin", "hr", "manager"), getOrganisation);

export default router;
