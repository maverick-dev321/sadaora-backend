import { Request, Response } from "express";
import { Follow, Like, Profile } from "../models";

export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, bio, headline, interests, photoUrl, backgroundUrl } =
      req.body;

    // Check if user already has a profile
    const existingProfile = await Profile.findOne({ where: { userId } });
    if (existingProfile) {
      return res
        .status(400)
        .json({ error: "Profile already exists for this user" });
    }

    const newProfile = await Profile.create({
      userId,
      name,
      bio,
      headline,
      photoUrl,
      backgroundUrl,
      interests: interests ? JSON.parse(interests) : [],
    });

    res.status(201).json({
      status: "success",
      data: {
        profile: newProfile,
      },
    });
  } catch (error) {
    console.error("Create profile error:", error);
    res.status(500).json({ error: "An error occurred while creating profile" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const profile = await Profile.findOne({
      where: { userId },
      include: ["user"],
    });

    const likeCount = await Like.count({ where: { profileId: profile?.id } });
    const followingCount = await Follow.count({
      where: { followerId: userId },
    });
    const followerCount = await Follow.count({
      where: { followingId: userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        profile,
        likeCount,
        followerCount,
        followingCount,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "An error occurred while fetching profile" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { name, bio, headline, interests, photoUrl, backgroundUrl } =
      req.body;

    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await profile.update({
      name,
      bio,
      headline,
      photoUrl,
      backgroundUrl,
      interests: interests ? JSON.parse(interests) : profile.interests,
    });

    const updatedProfile = await Profile.findOne({ where: { userId } });

    res.status(200).json({
      status: "success",
      data: {
        profile: updatedProfile,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "An error occurred while updating profile" });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const profile = await Profile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    await profile.destroy();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ error: "An error occurred while deleting profile" });
  }
};
