// src/controller/recommendation.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
import { calculateSimilarity } from "../utils/similarity";
import { aiService } from "../services/aiService";
import { averageVectors, getEmbeddingFromPinecone, pineconeService } from "../services/pineConeService";

export const getForYou = async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const userActivities = await prisma.userActivity.findMany({ where: { userId: req.user?.id } });
    const viewedBlogIds = userActivities.map(a => a.blogId);
    if (viewedBlogIds.length === 0) {
      // Fallback to latest or trending
      const blogs = await prisma.blog.findMany({ where: { status: "PUBLISHED" }, take: limit });
      res.status(200).json({ blogs });
       return
    }
    // Get embeddings of viewed blogs from Pinecone or regenerate; for efficiency, assume we fetch from Pinecone
    const viewedEmbeddings = await Promise.all(viewedBlogIds.map(id => getEmbeddingFromPinecone(id))); // Implement fetch
    const averageEmbedding = averageVectors(viewedEmbeddings.filter(Boolean) as number[][]);
    const filter = { status: 'PUBLISHED', $nin: { id: viewedBlogIds } }; // Pinecone filter to exclude viewed
    const similar = await pineconeService.querySimilarBlogs(averageEmbedding, limit * page, filter);
    const blogIds = similar.map(s => s.id);
    const blogs = await prisma.blog.findMany({ where: { id: { in: blogIds } } });
    const paginated = blogs.slice((page - 1) * limit, page * limit);
    res.status(200).json({ blogs: paginated });
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


