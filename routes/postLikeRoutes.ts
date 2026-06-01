import express from "express";
import {
  checkPostLikeStatus,
  likePost,
  unlikePost,
} from "../controllers/postLikeController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/:postId/like", likePost);
router.delete("/:postId/unlike", unlikePost);
router.get("/:postId/check-like", checkPostLikeStatus);

export default router;
