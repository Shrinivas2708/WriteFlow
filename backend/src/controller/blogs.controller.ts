// src/controller/blog.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
import { aiService } from "../services/aiService";
import { pineconeService, getEmbeddingFromPinecone } from "../services/pineConeService";

async function updateTrendingScore(blogId: string) {
  const stats = await prisma.blogStats.findUnique({ where: { blogId } });
  if (stats) {
    const score = 0.5 * stats.views + 0.3 * stats.likes + 0.2 * stats.shares;
    await prisma.blog.update({ where: { id: blogId }, data: { trendingScore: score } });
  }
}

// Auto-save draft
export const saveDraft = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId, title, content, coverImage } = req.body;
  try {
    let blog;
    if (blogId) {
      // Update existing draft
      blog = await prisma.blog.findUnique({ where: { id: blogId } });
      if (!blog || blog.authorId !== req.user!.id || blog.status !== "DRAFT") {
        return next(new AppError(403, "Not authorized or not a draft"));
      }
      blog = await prisma.blog.update({
        where: { id: blogId },
        data: {
          title,
          content,
          coverImage,
          draft: { update: { content, updatedAt: new Date() } },
        },
        include: { draft: true },
      });
    } else {
      // Create new draft
      blog = await prisma.blog.create({
        data: {
          title: title || "Untitled Draft",
          content: content || "",
          coverImage,
          authorId: req.user!.id,
          status: "DRAFT",
          draft: { create: { content: content || "" } },
        },
        include: { draft: true },
      });
    }
    res.status(200).json({ blogId: blog.id });
  } catch (error) {
    next(error);
  }
};

// Create blog (transition from draft or create unpublished/published)
export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId, title, content, coverImage, aiTags, status = "ARCHIVED" } = req.body;
  try {
    let blog;
    if (blogId) {
      // Transition existing draft
      const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
      if (!existingBlog || existingBlog.authorId !== req.user!.id || existingBlog.status !== "DRAFT") {
        return next(new AppError(403, "Not authorized or not a draft"));
      }
      const embedding = content ? await aiService.generateEmbedding(content) : null;
      const summary = content ? await aiService.summarize(content) : null;
      const recommendedTags = content ? await aiService.recommendTags(content) : [];
      blog = await prisma.blog.update({
        where: { id: blogId },
        data: {
          title,
          content,
          summary,
          coverImage,
          aiTags: aiTags || recommendedTags,
          status: status === "PUBLISHED" ? "PUBLISHED" : "ARCHIVED",
          publishedAt: status === "PUBLISHED" ? new Date() : null,
          draft: { delete: true }, // Remove draft record
        },
        include: { stats: true }, // Include stats
      });
      if (!blog.stats) {
        await prisma.blogStats.create({ data: { blogId: blog.id } });
      }
      if (embedding) {
        await pineconeService.upsertBlogEmbedding(blog.id, embedding, {
          authorId: req.user!.id,
          status: blog.status,
          publishedAt: blog.publishedAt?.toISOString(),
        });
      }
    } else {
      // Create new unpublished/published blog
      const embedding = content ? await aiService.generateEmbedding(content) : null;
      const summary = content ? await aiService.summarize(content) : null;
      const recommendedTags = content ? await aiService.recommendTags(content) : [];
      blog = await prisma.blog.create({
        data: {
          title,
          content,
          summary,
          coverImage,
          authorId: req.user!.id,
          aiTags: aiTags || recommendedTags,
          status: status === "PUBLISHED" ? "PUBLISHED" : "ARCHIVED",
          publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
        include: { stats: true }, // Include stats
      });
      await prisma.blogStats.create({ data: { blogId: blog.id } });
      if (embedding) {
        await pineconeService.upsertBlogEmbedding(blog.id, embedding, {
          authorId: req.user!.id,
          status: blog.status,
          publishedAt: blog.publishedAt?.toISOString(),
        });
      }
    }
    res.status(200).json({ blogId: blog.id });
  } catch (error) {
    next(error);
  }
};

// Update blog (handles drafts, unpublished, published)
export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const { title, content, summary, coverImage, aiTags } = req.body;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user!.id) return next(new AppError(403, "Not authorized"));
    const isDraft = blog.status === "DRAFT";
    const newEmbedding = content && !isDraft ? await aiService.generateEmbedding(content) : null;
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title,
        content,
        summary: isDraft ? undefined : summary || (content ? await aiService.summarize(content) : null),
        coverImage,
        aiTags: aiTags || (content && !isDraft ? await aiService.recommendTags(content) : undefined),
        draft: isDraft ? { update: { content, updatedAt: new Date() } } : undefined,
      },
      include: { stats: true }, // Include stats
    });
    if (newEmbedding) {
      await pineconeService.upsertBlogEmbedding(blogId, newEmbedding, {
        authorId: req.user!.id,
        status: updatedBlog.status,
        publishedAt: updatedBlog.publishedAt?.toISOString(),
      });
    }
    res.status(200).json({ message: "Updated", blogId: updatedBlog.id });
  } catch (error) {
    next(error);
  }
};

// Delete blog (including drafts)
export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user!.id) return next(new AppError(403, "Not authorized"));
    await prisma.blog.delete({ where: { id: blogId } });
    if (blog.status !== "DRAFT") {
      await pineconeService.deleteBlogEmbedding(blogId);
    }
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

// Publish blog
export const publishBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user!.id) return next(new AppError(403, "Not authorized"));
    const embedding = await getEmbeddingFromPinecone(blogId) || (blog.content ? await aiService.generateEmbedding(blog.content) : null);
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
        draft: blog.status === "DRAFT" ? { delete: true } : undefined,
      },
      include: { stats: true }, // Include stats
    });
    if (embedding) {
      await pineconeService.upsertBlogEmbedding(blogId, embedding, {
        authorId: req.user!.id,
        status: "PUBLISHED",
        publishedAt: updatedBlog.publishedAt?.toISOString(),
      });
    }
    res.status(200).json({ message: "Published" });
  } catch (error) {
    next(error);
  }
};

// Unpublish blog
export const unpublishBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user!.id) return next(new AppError(403, "Not authorized"));
    const embedding = await getEmbeddingFromPinecone(blogId);
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: { status: "ARCHIVED" },
      include: { stats: true }, // Include stats
    });
    if (embedding) {
      await pineconeService.upsertBlogEmbedding(blogId, embedding, {
        authorId: req.user!.id,
        status: "ARCHIVED",
        publishedAt: updatedBlog.publishedAt?.toISOString(),
      });
    }
    res.status(200).json({ message: "Unpublished" });
  } catch (error) {
    next(error);
  }
};

// Get a single blog
export const getBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        stats: true,
        usertags: { include: { tag: true } },
        draft: true,
      },
    });
    if (!blog) return next(new AppError(404, "Blog not found"));
    if (blog.status !== "PUBLISHED" && blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    res.status(200).json({ blog });
  } catch (error) {
    next(error);
  }
};

// List blogs (user-specific or public)
export const listBlogs = async (req: Request, res: Response, next: NextFunction) => {
  const { status, authorId, tag, search, page = "1", limit = "10", userBlogs = "false" } = req.query;
  try {
    const isUserBlogs = userBlogs === "true" && req.user?.id;
    const where: any = {};

    if (isUserBlogs) {
      // Fetch user-specific blogs (drafts, unpublished, published)
      where.authorId = req.user!.id;
      if (status) where.status = status as string;
    } else {
      // Fetch public blogs (published only)
      where.status = "PUBLISHED";
      if (authorId) where.authorId = authorId as string;
    }

    if (tag) where.usertags = { some: { tag: { name: tag as string } } };

    if (search) {
      const queryEmbedding = await aiService.generateEmbedding(search as string);
      const filter = isUserBlogs ? { authorId: req.user!.id } : { status: "PUBLISHED" };
      const similarBlogs = await pineconeService.querySimilarBlogs(queryEmbedding, Number(limit) * Number(page), filter);
      const blogIds = similarBlogs.map(b => b.id);
      const blogs = await prisma.blog.findMany({
        where: { id: { in: blogIds }, ...where },
        include: {
          author: { select: { username: true } },
          stats: true,
          draft: isUserBlogs ? { select: { content: true, updatedAt: true } } : undefined,
        },
        orderBy: { publishedAt: "desc" },
      });
      const sortedBlogs = similarBlogs
        .map(sim => blogs.find(blog => blog.id === sim.id))
        .filter((blog): blog is NonNullable<typeof blog> => !!blog)
        .slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
      res.status(200).json({ blogs: sortedBlogs, total: sortedBlogs.length });
      return;
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: { select: { username: true } },
        stats: true,
        draft: isUserBlogs ? { select: { content: true, updatedAt: true } } : undefined,
      },
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

// View blog
export const viewBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || (blog.status !== "PUBLISHED" && blog.authorId !== req.user?.id)) {
      return next(new AppError(403, "Not authorized"));
    }
    await prisma.viewedBlog.create({
      data: { userId: req.user!.id, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { views: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user!.id, blogId, type: "VIEW" },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Viewed" });
  } catch (error) {
    next(error);
  }
};

// Like blog
export const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const existing = await prisma.likedBlog.findFirst({
      where: { userId: req.user!.id, blogId },
    });
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (existing) return next(new AppError(400, "Already liked"));
    await prisma.likedBlog.create({
      data: { userId: req.user!.id, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { likes: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user!.id, blogId, type: "LIKE" },
    });
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    await prisma.notification.create({
      data: {
        userId: blog!.authorId,
        type: "LIKE",
        message: `${user!.username} liked your blog "${blog!.title}"`,
      },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Liked" });
  } catch (error) {
    next(error);
  }
};

// Unlike blog
export const unlikeBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    await prisma.likedBlog.deleteMany({
      where: { userId: req.user!.id, blogId },
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

// Share blog
export const shareBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    await prisma.sharedBlog.create({
      data: { userId: req.user!.id, blogId },
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { shares: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user!.id, blogId, type: "SHARE" },
    });
    await updateTrendingScore(blogId);
    res.status(200).json({ message: "Shared" });
  } catch (error) {
    next(error);
  }
};

// Bookmark blog
export const bookmarkBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    const existing = await prisma.bookmark.findFirst({
      where: { userId: req.user!.id, blogId },
    });
    if (existing) return next(new AppError(400, "Already bookmarked"));
    await prisma.bookmark.create({
      data: { userId: req.user!.id, blogId }, // Fixed: bookId -> blogId
    });
    await prisma.blogStats.update({
      where: { blogId },
      data: { bookmarks: { increment: 1 } },
    });
    await prisma.userActivity.create({
      data: { userId: req.user!.id, blogId, type: "BOOKMARK" },
    });
    res.status(200).json({ message: "Bookmarked" });
  } catch (error) {
    next(error);
  }
};

// Unbookmark blog
export const unbookmarkBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  try {
    await prisma.bookmark.deleteMany({
      where: { userId: req.user!.id, blogId },
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

// Get blog stats
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

// Get blog analytics
export const getBlogAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  const { blogId } = req.params;
  const fromDate = req.query.fromDate ? new Date(req.query.fromDate as string) : undefined;
  const toDate = req.query.toDate ? new Date(req.query.toDate as string) : undefined;
  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog || blog.authorId !== req.user!.id) return next(new AppError(403, "Not authorized"));
    const analytics = await prisma.blogAnalyticsSnapshot.findMany({
      where: { blogId, date: { gte: fromDate, lte: toDate } },
      orderBy: { date: "asc" },
    });
    res.status(200).json({ analytics });
  } catch (error) {
    next(error);
  }
};