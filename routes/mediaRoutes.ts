import express from "express";
import multer from "multer";
import { uploadMedia } from "../controllers/mediaController";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("media"), uploadMedia);

export default router;
