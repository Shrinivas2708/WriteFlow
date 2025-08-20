// src/controller/trending.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";

export const getTrendingBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: "PUBLISHED" },
      include: { author: { select: { username: true } }, stats: true },
      orderBy: { trendingScore: "desc" },
      take: limit,
    });
    res.status(200).json({ blogs });
  } catch (error) {
    next(error);
  }
};

export const getTrendingTags = async (req: Request, res: Response, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { trendingScore: "desc" },
      take: limit,
    });
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
};

export const getTrendingAuthors = async (req: Request, res: Response, next: NextFunction) => {
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const authors = await prisma.user.findMany({
      orderBy: { trendingScore: "desc" },
      take: limit,
      select: { id: true, username: true, avatar: true, trendingScore: true },
    });
    res.status(200).json({ authors });
  } catch (error) {
    next(error);
  }
};

// Cron job to update trending scores
export const updateTrendingScores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Update blog scores
    const blogs = await prisma.blog.findMany({ include: { stats: true } });
    for (const blog of blogs) {
      if (blog.stats) {
        const score = 0.5 * blog.stats.views + 0.3 * blog.stats.likes + 0.2 * blog.stats.shares;
        await prisma.blog.update({ where: { id: blog.id }, data: { trendingScore: score } });
        await prisma.blogAnalyticsSnapshot.create({
          data: {
            blogId: blog.id,
            date: new Date(),
            views: blog.stats.views,
            likes: blog.stats.likes,
            shares: blog.stats.shares,
            bookmarks: blog.stats.bookmarks,
          },
        });
      }
    }
    // Update tag scores
    const tags = await prisma.tag.findMany(
      {
        include:{
          blogTags:{
            include:{
              blog:{
                include:{
                  stats:true
                }
              }
            }
          }
        }
      }
    );
    // { include: { blogTags: { include: { blog: { include: { stats: true } } } } }
    for (const tag of tags) {
      const tagBlogs = tag.blogTags.map(bt => bt.blog);
      const score = tagBlogs.reduce((sum, blog) => sum + (blog.stats ? blog.stats.views * 0.5 + blog.stats.likes * 0.3 : 0), 0);
      await prisma.tag.update({ where: { id: tag.id }, data: { trendingScore: score } });
    }
    // Update author scores
    const users = await prisma.user.findMany({ include: { blogs: { include: { stats: true } } } });
    for (const user of users) {
      const score = user.blogs.reduce((sum, blog) => sum + (blog.stats ? blog.stats.views * 0.5 + blog.stats.likes * 0.3 : 0), 0);
      await prisma.user.update({ where: { id: user.id }, data: { trendingScore: score } });
    }
    res.status(200).json({ message: "Trending scores updated" });
  } catch (error) {
    next(error);
  }
};