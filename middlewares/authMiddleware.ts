import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    // 1) Getting token and check if it's there
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        error: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // 3) Check if user still exists
    const currentUser = await User.findByPk(decoded.userId);
    if (!currentUser) {
      return res.status(401).json({
        error: "The user belonging to this token does no longer exist.",
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      error: "Invalid token. Please log in again.",
    });
  }
};
