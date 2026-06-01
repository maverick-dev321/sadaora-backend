import { Request, Response } from "express";
import { Comment, Post, PostLike, User } from "../models";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, description, imageDescription, imageUrl } = req.body;

    const newPost = await Post.create({
      userId: req.user.id,
      title,
      description,
      imageUrl,
      imageDescription,
    });

    // Include user data in the response
    const postWithUser = await Post.findByPk(newPost.id, {
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
        post: postWithUser,
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "An error occurred while creating post" });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          include: ["profile"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              include: ["profile"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    // Check if current user has liked each post
    const postsWithLikes = await Promise.all(
      rows.map(async (post) => {
        const like = await PostLike.findOne({
          where: {
            ...(req.user?.id && { userId: req.user?.id }),
            postId: post.id,
          },
        });
        return {
          ...post.toJSON(),
          isLiked: !!like,
          likeCount: await PostLike.count({ where: { postId: post.id } }),
        };
      })
    );

    res.status(200).json({
      status: "success",
      results: count,
      data: {
        posts: postsWithLikes,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};

export const getPostByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          include: ["profile"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              include: ["profile"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({ error: "An error occurred while fetching posts" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: "user",
          include: ["profile"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              include: ["profile"],
            },
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if current user has liked the post
    const like = await PostLike.findOne({
      where: {
        userId: req.user.id,
        postId: post.id,
      },
    });

    const likeCount = await PostLike.count({ where: { postId: post.id } });

    res.status(200).json({
      status: "success",
      data: {
        post: {
          ...post.toJSON(),
          isLiked: !!like,
          likeCount,
        },
      },
    });
  } catch (error) {
    console.error("Get post by ID error:", error);
    res.status(500).json({ error: "An error occurred while fetching post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findOne({
      where: {
        id: postId,
        userId: req.user.id,
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    await post.destroy();

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "An error occurred while deleting post" });
  }
};
