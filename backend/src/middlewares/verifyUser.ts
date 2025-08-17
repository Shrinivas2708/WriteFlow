import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/verifyToken";
import { logger } from "../utils/logger";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Unauthorized: Missing or invalid token"));
  }

  const token = authHeader.split(" ")[1];

  try {
    logger.info("From the Access token!")
    const decoded = verifyToken(token, process.env.JWT_SECRET_ACCESSTOKEN!);

    req.user = {
      id: decoded.id!,
     email:decoded.email!
    };

    next();
  } catch (error) {
    next(error);
  }
};
