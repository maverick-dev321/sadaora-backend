import express from "express";
import { getProfilesFeed } from "../controllers/feedController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/public", getProfilesFeed);
router.get("/", protect, getProfilesFeed);

export default router;
