// src/controller/comment.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const { content } = req.body;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    const user = await prisma.user.findFirst({where:{id:req.user?.id}})
    
    if (!blog) return next(new AppError(404, "Blog not found"));
    const comment = await prisma.comment.create({
      data: { userId: req.user?.id!, blogId, content },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { comments: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user?.id!, blogId, type: "COMMENT" },
    });
    await prisma.notification.create({
      data: {
        userId: blog.authorId,
        type: "COMMENT",
        message: `${user?.username} commented on your blog "${blog.title}"`,
      },
    });
    res.status(200).json({ commentId: comment.id });
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  const { content } = req.body;
  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { commentId } = req.params;
  try {
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return next(new AppError(404, "Comment not found"));
    const blog = await prisma.blog.findUnique({ where: { id: comment.blogId } });
    if (comment.userId !== req.user?.id && blog?.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.comment.delete({ where: { id: commentId } });
    await prisma.blogStats.update({
      where: { blogId: comment.blogId },
      data: { comments: { decrement: 1 } },
    });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export const listComments = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const comments = await prisma.comment.findMany({
      where: { blogId },
      include: { user: { select: { id: true, username: true, avatar: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.comment.count({ where: { blogId } });
    res.status(200).json({ comments, total });
  } catch (error) {
    next(error);
  }
};