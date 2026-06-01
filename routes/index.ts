import express from "express";
import authRoutes from "./authRoutes";
import commentRoutes from "./commentRoutes";
import feedRoutes from "./feedRoutes";
import followRoutes from "./followRoutes";
import likeRoutes from "./likeRoutes";
import mediaRoutes from "./mediaRoutes";
import postLikeRoutes from "./postLikeRoutes";
import postRoutes from "./postRoutes";
import profileRoutes from "./profileRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/feed", feedRoutes);
router.use("/follow", followRoutes);
router.use("/like", likeRoutes);
router.use("/posts", postRoutes);
router.use("/posts", postLikeRoutes);
router.use("/posts", commentRoutes);
router.use("/media", mediaRoutes);

export default router;
