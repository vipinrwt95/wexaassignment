import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

export default router;