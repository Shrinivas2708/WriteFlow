// src/controller/user.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        interests: true,
        createdAt: true,
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
        blogs: { where: { status: "PUBLISHED" }, select: { id: true } },
      },
    });
    if (!user) return next(new AppError(404, "User not found"));
    // Construct new object instead of using delete
    const profile = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      interests: user.interests,
      createdAt: user.createdAt,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      blogsCount: user.blogs.length,
    };
    res.status(200).json({ user: profile });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  // req.user.id is populated by the verifyUser middleware
  const userId = req.user?.id;
  if (!userId) {
    return next(new AppError(401, "Unauthorized: User ID not found in token."));
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        interests: true,
        createdAt: true,
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
        blogs: { where: { status: "PUBLISHED" }, select: { id: true } },
      },
    });
    if (!user) return next(new AppError(404, "User profile not found.")); // Should ideally not happen if user is authenticated
    const profile = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      interests: user.interests,
      createdAt: user.createdAt,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      blogsCount: user.blogs.length,
    };
    res.status(200).json({ user: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  const { username, firstName, lastName, avatar, interests } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { username, firstName, lastName, avatar, interests },
    });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const followers = await prisma.follows.findMany({
      where: { followingId: userId },
      select: { follower: { select: { id: true, username: true, avatar: true } } },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.follows.count({ where: { followingId: userId } });
    res.status(200).json({ followers: followers.map(f => f.follower), total });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const following = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { following: { select: { id: true, username: true, avatar: true } } },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.follows.count({ where: { followerId: userId } });
    res.status(200).json({ following: following.map(f => f.following), total });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  const { targetUserId } = req.params;
  if (targetUserId === req.user?.id) return next(new AppError(400, "Cannot follow yourself"));
  try {
    const user = await prisma.user.findFirst({ where: { id: req.user?.id } });
    if (!user) return next(new AppError(404, "User not found"));
    await prisma.follows.create({
      data: { followerId: req.user!.id, followingId: targetUserId },
    });
    await prisma.userReach.upsert({
      where: { userId: targetUserId },
      update: { followers: { increment: 1 } },
      create: { userId: targetUserId, followers: 1 },
    });
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: "FOLLOW",
        message: `${user.username} followed you`,
      },
    });
    res.status(200).json({ message: "Followed" });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
  const { targetUserId } = req.params;
  try {
    await prisma.follows.deleteMany({
      where: { followerId: req.user!.id, followingId: targetUserId },
    });
    await prisma.userReach.update({
      where: { userId: targetUserId },
      data: { followers: { decrement: 1 } },
    });
    res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    next(error);
  }
};

export const getUserReach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reach = await prisma.userReach.findUnique({
      where: { userId: req.user!.id },
    });
    res.status(200).json({ reach: reach || { totalViews: 0, totalLikes: 0, totalShares: 0, followers: 0 } });
  } catch (error) {
    next(error);
  }
};

export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
  const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId: req.user!.id, publishedAt: { gte: fromDate, lte: toDate } },
      include: { stats: true },
    });
    const analytics = blogs.reduce(
      (acc, blog) => {
        if (blog.stats) {
          acc.totalViews += blog.stats.views;
          acc.totalLikes += blog.stats.likes;
          acc.totalShares += blog.stats.shares;
          acc.totalComments += blog.stats.comments;
          acc.totalBookmarks += blog.stats.bookmarks;
        }
        return acc;
      },
      { totalViews: 0, totalLikes: 0, totalShares: 0, totalComments: 0, totalBookmarks: 0 }
    );
    res.status(200).json({ analytics });
  } catch (error) {
    next(error);
  }
};