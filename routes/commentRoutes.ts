import express from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/commentController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.route("/:postId/comments").post(createComment).get(getComments);

router.delete("/comments/:commentId", deleteComment);

export default router;
