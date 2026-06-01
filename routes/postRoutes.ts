import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPostByUserId,
  getPosts,
} from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/public", getPosts);
router.get("/:userId/user", getPostByUserId);
router.get("/", protect, getPosts);
router.post("/", protect, createPost);

router.get("/:postId", protect, getPostById);
router.delete("/:postId", protect, deletePost);

export default router;
