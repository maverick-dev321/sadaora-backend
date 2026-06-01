import { Request, Response } from "express";
import { Comment, Post, User } from "../models";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = await Comment.create({
      userId: req.user.id,
      postId,
      content,
    });

    // Include user data in the response
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: "user",
          include: ["profile"],
        },
      ],
    });

    res.status(201).json({
      status: "success",
      data: {
        comment: commentWithUser,
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ error: "An error occurred while creating comment" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Comment.findAndCountAll({
      where: { postId },
      include: [
        {
          model: User,
          as: "user",
          include: ["profile"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: "success",
      results: count,
      data: {
        comments: rows,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching comments" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findOne({
      where: {
        id: commentId,
        userId: req.user.id,
      },
    });

    if (!comment) {
      return res
        .status(404)
        .json({ error: "Comment not found or not authorized" });
    }

    await comment.destroy();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ error: "An error occurred while deleting comment" });
  }
};
