import { Request, Response } from "express";
import { Op } from "sequelize";
import { Profile } from "../models";

export const getProfilesFeed = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const interests = req.query.interests as string;

    const whereClause: any = {
      ...(currentUserId && {
        userId: {
          [Op.ne]: currentUserId,
        },
      }),
    };

    if (interests) {
      const interestsArray = interests.split(",");
      whereClause.interests = {
        [Op.overlap]: interestsArray,
      };
    }

    const { count, rows } = await Profile.findAndCountAll({
      where: whereClause,
      include: [
        "user",
        {
          association: "likedByUsers",
          through: { attributes: [] },
          include: ["profile"],
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      status: "success",
      results: count,
      data: {
        profiles: rows,
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Get profiles feed error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching profiles feed" });
  }
};
