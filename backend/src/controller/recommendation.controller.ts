// src/controller/recommendation.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
import { calculateSimilarity } from "../utils/similarity";
import { aiService } from "../services/aiService";

export const getForYou = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const userActivities = await prisma.userActivity.findMany({ where: { userId: req.user?.id } });
    const viewedBlogs = userActivities.map(a => a.blogId);
    const blogs = await prisma.blog.findMany({ where: { status: "PUBLISHED" }, include: { stats: true } });
    const recommended = blogs
      .filter(b => !viewedBlogs.includes(b.id))
      .map(blog => ({
        ...blog,
        similarity: viewedBlogs.reduce((sum, vbId) => {
          const vb = blogs.find(bl => bl.id === vbId);
          return sum + (vb ? calculateSimilarity(blog.embedding as number[], vb.embedding as number[]) : 0);
        }, 0) / (viewedBlogs.length || 1),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice((page - 1) * limit, page * limit);
    // Log recommendations
    for (const blog of recommended) {
      await prisma.recommendation.create({
        data: {
          userId: req.user?.id!,
          blogId: blog.id,
          shownAt: new Date(),
        },
      });
    }
    res.status(200).json({ blogs: recommended });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const following = await prisma.follows.findMany({ where: { followerId: req.user?.id }, select: { followingId: true } });
    const followingIds = following.map(f => f.followingId);
    const blogs = await prisma.blog.findMany({
      where: { authorId: { in: followingIds }, status: "PUBLISHED" },
      include: { author: { select: { username: true } }, stats: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.blog.count({ where: { authorId: { in: followingIds }, status: "PUBLISHED" } });
    res.status(200).json({ blogs, total });
  } catch (error) {
    next(error);
  }
};

export const getLatest = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: { author: { select: { username: true } }, stats: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.blog.count({ where: { status: "PUBLISHED" } });
    res.status(200).json({ blogs, total });
  } catch (error) {
    next(error);
  }
};

export const getCustom = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const section = await prisma.customSection.findUnique({ where: { id: sectionId } });
    if (!section || section.userId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    const blogs = await prisma.blog.findMany({
      where: {
        status: "PUBLISHED",
        usertags: { some: { tag: { name: { in: section.tags } } } },
      },
      include: { author: { select: { username: true } }, stats: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });
    const total = await prisma.blog.count({
      where: { status: "PUBLISHED", usertags: { some: { tag: { name: { in: section.tags } } } } },
    });
    res.status(200).json({ blogs, total });
  } catch (error) {
    next(error);
  }
};

export const markRecommendationClicked = async (req: Request, res: Response, next: NextFunction) => {
  const { recommendationId } = req.params;
  try {
    const recommendation = await prisma.recommendation.findUnique({ where: { id: recommendationId } });
    if (!recommendation || recommendation.userId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.recommendation.update({
      where: { id: recommendationId },
      data: { clicked: true },
    });
    res.status(200).json({ message: "Marked" });
  } catch (error) {
    next(error);
  }
};