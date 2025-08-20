// src/controller/notification.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const unreadOnly = req.query.unreadOnly === "true";
  try {
    const where: any = { userId: req.user?.id };
    if (unreadOnly) where.isRead = false;
    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.notification.count({ where });
    res.status(200).json({ notifications, total });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  const { notificationId } = req.params;
  try {
    const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notification || notification.userId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    next(error);
  }
};