import express from "express";
import {
  checkFollowStatus,
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../controllers/followController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/:userId/follow", followUser);
router.delete("/:userId/unfollow", unfollowUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
router.get("/:userId/check-follow", checkFollowStatus);

export default router;
