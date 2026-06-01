import express from "express";
import {
  checkLikeStatus,
  getProfileLikes,
  likeProfile,
  unlikeProfile,
} from "../controllers/likeController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/:profileId/like", likeProfile);
router.delete("/:profileId/unlike", unlikeProfile);
router.get("/:profileId/likes", getProfileLikes);
router.get("/:profileId/check-like", checkLikeStatus);

export default router;
