import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "../services/s3Service";

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    let mediaUrl = "";

    if (req.file) {
      const fileExtension = req.file.originalname.split(".").pop();
      const fileName = `media-${uuidv4()}.${fileExtension}`;
      mediaUrl = await uploadToS3(req.file.buffer, fileName, req.file.mimetype);
    }

    res.status(200).json({
      status: "success",
      data: {
        url: mediaUrl,
      },
    });
  } catch (error) {
    console.error("Upload media error:", error);
    res.status(500).json({ error: "An error occurred while uploading media" });
  }
};
