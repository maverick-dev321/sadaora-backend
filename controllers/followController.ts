import { Request, Response } from "express";
import { Follow, User } from "../models";

export const followUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId) {
      return res.status(400).json({ error: "You cannot follow  yourself" });
    }

    const userToFollow = await User.findByPk(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    const [follow, created] = await Follow.findOrCreate({
      where: { followerId: currentUserId, followingId: userId },
    });

    if (!created) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    res.status(200).json({
      status: "success",
      data: {
        follow,
      },
    });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ error: "An error occurred while following user" });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const result = await Follow.destroy({
      where: { followerId: currentUserId, followingId: userId },
    });

    if (result === 0) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({ error: "An error occurred while unfollowing user" });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: [
        {
          association: "followers",
          through: { attributes: [] },
          include: ["profile"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        followers: user.followers,
      },
    });
  } catch (error) {
    console.error("Get followers error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching followers" });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      include: [
        {
          association: "following",
          through: { attributes: [] },
          include: ["profile"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        following: user.following,
      },
    });
  } catch (error) {
    console.error("Get following error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching following" });
  }
};

export const checkFollowStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const follow = await Follow.findOne({
      where: { followerId: currentUserId, followingId: userId },
    });

    res.status(200).json({
      status: "success",
      data: {
        isFollowing: !!follow,
      },
    });
  } catch (error) {
    console.error("Check follow status error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking follow status" });
  }
};
