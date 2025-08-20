// src/controller/blog.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
import { calculateSimilarity } from "../utils/similarity";
import { aiService } from "../services/aiService";

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { title, content, coverImage, aiTags } = req.body;
  try {
    const embedding = content ? await aiService.generateEmbedding(content) : null;
    const summary = content ? await aiService.summarize(content) : null;
    const recommendedTags = content ? await aiService.recommendTags(content) : [];
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        summary,
        coverImage,
        authorId: req.user?.id!,
        embedding,
        aiTags: aiTags || recommendedTags,
      },
    });
    await prisma.blogStats.create({ data: { blogId: blog.id } });
    res.status(200).json({ blogId: blog.id });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const { title, content, summary, coverImage, usertags } = req.body;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    const newEmbedding = content ? await aiService.generateEmbedding(content) : blog.embedding;
    await prisma.blog.update({
      where: { id: blogId },
      data: { title, content, summary, coverImage, embedding: newEmbedding },
    });
    if (usertags) {
      await prisma.blogTag.deleteMany({ where: { blogId } });
      for (const tagName of usertags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: { usageCount: { increment: 1 } },
          create: { name: tagName, usageCount: 1 },
        });
        await prisma.blogTag.create({ data: { blogId, tagId: tag.id } });
      }
    }
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.blog.delete({ where: { id: blogId } });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export const publishBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.blog.update({
      where: { id: blogId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Published" });
  } catch (error) {
    next(error);
  }
};

export const unpublishBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.blog.update({
      where: { id: blogId },
      data: { status: "ARCHIVED" },
    });
    res.status(200).json({ message: "Unpublished" });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        stats: true,
        usertags: { include: { tag: true } },
      },
    });
    if (!blog) return next(new AppError(404, "Blog not found"));
    if (blog.status !== "PUBLISHED" && blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    res.status(200).json({ blog });
  } catch (error) {
    next(error);
  }
};

export const listBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const { status, authorId, tag, search, page = "1", limit = "10" } = req.query;
  try {
    const where: any = {};
    if (status) where.status = status as string;
    if (authorId) where.authorId = authorId as string;
    if (tag) where.usertags = { some: { tag: { name: tag as string } } };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { content: { contains: search as string, mode: "insensitive" } },
      ];
      // For semantic search, fetch all blogs and sort by embedding similarity
      if (req.user?.id) {
        const queryEmbedding = await aiService.generateEmbedding(search as string);
        const blogs = await prisma.blog.findMany({ where: { status: "PUBLISHED" }, include: { stats: true } });
        const sortedBlogs = blogs
          .map(blog => ({
            ...blog,
            similarity: calculateSimilarity(queryEmbedding, blog.embedding as number[]),
          }))
          .sort((a, b) => b.similarity - a.similarity)
          .slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
         res.status(200).json({ blogs: sortedBlogs, total: blogs.length });
         return
      }
    }
    const blogs = await prisma.blog.findMany({
      where,
      include: { author: { select: { username: true } }, stats: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { publishedAt: "desc" },
    });
    const total = await prisma.blog.count({ where });
    res.status(200).json({ blogs, total });
  } catch (error) {
    next(error);
  }
};

export const viewBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || (blog.status !== "PUBLISHED" && blog.authorId !== req.user?.id)) {
      return next(new AppError(403, "Not authorized"));
    }
    await prisma.viewedBlog.create({
      data: { userId: req.user?.id!, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { views: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user?.id!, blogId, type: "VIEW" },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Viewed" });
  } catch (error) {
    next(error);
  }
};

export const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const existing = await prisma.likedBlog.findFirst({
      where: { userId: req.user?.id, blogId },
    });
    if (existing) return next(new AppError(400, "Already liked"));
    await prisma.likedBlog.create({
      data: { userId: req.user?.id!, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { likes: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user?.id!, blogId, type: "LIKE" },
    });
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    await prisma.notification.create({
      data: {
        userId: blog?.authorId!,
        type: "LIKE",
        message: `${req.user?.username} liked your blog "${blog?.title}"`,
      },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Liked" });
  } catch (error) {
    next(error);
  }
};

export const unlikeBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    await prisma.likedBlog.deleteMany({
      where: { userId: req.user?.id, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { likes: { decrement: 1 } },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Unliked" });
  } catch (error) {
    next(error);
  }
};

export const shareBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    await prisma.sharedBlog.create({
      data: { userId: req.user?.id!, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { shares: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user?.id!, blogId, type: "SHARE" },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Shared" });
  } catch (error) {
    next(error);
  }
};

export const bookmarkBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const existing = await prisma.bookmark.findFirst({
      where: { userId: req.user?.id, blogId },
    });
    if (existing) return next(new AppError(400, "Already bookmarked"));
    await prisma.bookmark.create({
      data: { userId: req.user?.id!, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { bookmarks: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user?.id!, blogId, type: "BOOKMARK" },
    });
    res.status(200).json({ message: "Bookmarked" });
  } catch (error) {
    next(error);
  }
};

export const unbookmarkBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    await prisma.bookmark.deleteMany({
      where: { userId: req.user?.id, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { bookmarks: { decrement: 1 } },
    });
    res.status(200).json({ message: "Unbookmarked" });
  } catch (error) {
    next(error);
  }
};

export const getBlogStats = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const stats = await prisma.blogStats.findUnique({ where: { blogId } });
    if (!stats) return next(new AppError(404, "Stats not found"));
    res.status(200).json({ stats });
  } catch (error) {
    next(error);
  }
};

export const getBlogAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
  const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    const analytics = await prisma.blogAnalyticsSnapshot.findMany({
      where: { blogId, date: { gte: fromDate, lte: toDate } },
      orderBy: { date: "asc" },
    });
    res.status(200).json({ analytics });
  } catch (error) {
    next(error);
  }
};

async function updateTrendingScore(blogId: string) {
  const stats = await prisma.blogStats.findUnique({ where: { blogId } });
  if (stats) {
    const score = 0.5 * stats.views + 0.3 * stats.likes + 0.2 * stats.shares;
    await prisma.blog.update({ where: { id: blogId }, data: { trendingScore: score } });
  }
}