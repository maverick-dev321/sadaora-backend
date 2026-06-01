import express from "express";
import {
  createProfile,
  deleteProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/:userId", getProfile);

router.use(protect);

router
  .route("/")
  .post(createProfile)
  .patch(updateProfile)
  .delete(deleteProfile);

export default router;
