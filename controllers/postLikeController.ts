import { Request, Response } from "express";
import { Post, PostLike } from "../models";

export const likePost = async (req: Request, res: Response) => {
  try {
    console.log("req.params", req.params);
    const { postId } = req.params;
    const currentUserId = req.user.id;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is trying to like their own post
    if (post.userId === currentUserId) {
      return res.status(400).json({ error: "You cannot like your own post" });
    }

    const [like, created] = await PostLike.findOrCreate({
      where: { userId: currentUserId, postId },
    });

    if (!created) {
      return res
        .status(400)
        .json({ error: "You have already liked this post" });
    }

    const likeCount = await PostLike.count({ where: { postId } });

    res.status(200).json({
      status: "success",
      data: {
        like,
        likeCount,
      },
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ error: "An error occurred while liking post" });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user.id;

    const result = await PostLike.destroy({
      where: { userId: currentUserId, postId },
    });

    if (result === 0) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    const likeCount = await PostLike.count({ where: { postId } });

    res.status(200).json({
      status: "success",
      data: {
        likeCount,
      },
    });
  } catch (error) {
    console.error("Unlike post error:", error);
    res.status(500).json({ error: "An error occurred while unliking post" });
  }
};

export const checkPostLikeStatus = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.user.id;

    const like = await PostLike.findOne({
      where: { userId: currentUserId, postId },
    });

    const likeCount = await PostLike.count({ where: { postId } });

    res.status(200).json({
      status: "success",
      data: {
        isLiked: !!like,
        likeCount,
      },
    });
  } catch (error) {
    console.error("Check post like status error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking like status" });
  }
};
