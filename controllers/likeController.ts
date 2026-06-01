import { Request, Response } from "express";
import { Like, Profile } from "../models";

export const likeProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const currentUserId = req.user.id;

    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Check if user is trying to like their own profile
    if (profile.userId === currentUserId) {
      return res
        .status(400)
        .json({ error: "You cannot like your own profile" });
    }

    const [like, created] = await Like.findOrCreate({
      where: { userId: currentUserId, profileId },
    });

    if (!created) {
      return res
        .status(400)
        .json({ error: "You have already liked this profile" });
    }

    res.status(200).json({
      status: "success",
      data: {
        like,
      },
    });
  } catch (error) {
    console.error("Like profile error:", error);
    res.status(500).json({ error: "An error occurred while liking profile" });
  }
};

export const unlikeProfile = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const currentUserId = req.user.id;

    const result = await Like.destroy({
      where: { userId: currentUserId, profileId },
    });

    if (result === 0) {
      return res.status(400).json({ error: "You have not liked this profile" });
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Unlike profile error:", error);
    res.status(500).json({ error: "An error occurred while unliking profile" });
  }
};

export const getProfileLikes = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findByPk(profileId, {
      include: [
        {
          association: "likedByUsers",
          through: { attributes: [] },
          include: ["profile"],
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        likes: profile.likedByUsers,
        likeCount: profile.likedByUsers?.length || 0,
      },
    });
  } catch (error) {
    console.error("Get profile likes error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching profile likes" });
  }
};

export const checkLikeStatus = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params;
    const currentUserId = req.user.id;

    const like = await Like.findOne({
      where: { userId: currentUserId, profileId },
    });

    res.status(200).json({
      status: "success",
      data: {
        isLiked: !!like,
      },
    });
  } catch (error) {
    console.error("Check like status error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking like status" });
  }
};
