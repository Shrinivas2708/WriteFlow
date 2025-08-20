// src/controller/progress.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";

export const updateProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const { scrollPos } = req.body;
  if (typeof scrollPos !== "number") return next(new AppError(400, "Invalid scrollPos"));
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return next(new AppError(404, "Blog not found"));
    await prisma.readingProgress.upsert({
      where: { userId_blogId: { userId: req.user?.id!, blogId } },
      update: { scrollPos, updatedAt: new Date() },
      create: { userId: req.user?.id!, blogId, scrollPos },
    });
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const progress = await prisma.readingProgress.findUnique({
      where: { userId_blogId: { userId: req.user?.id!, blogId } },
    });
    res.status(200).json({ scrollPos: progress?.scrollPos || 0 });
  } catch (error) {
    next(error);
  }
};