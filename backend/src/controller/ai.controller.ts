// src/controller/ai.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
import { aiService } from "../services/aiService";

export const generateCoverImage = async (req: Request, res: Response, next: NextFunction) => {
  const { prompt } = req.body;
  if (!prompt) return next(new AppError(400, "Prompt required"));
  try {
    const coverImageUrl = await aiService.generateImage(prompt);
    res.status(200).json({ coverImageUrl });
  } catch (error) {
    next(error);
  }
};

export const summarizeBlog = async (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  if (!content) return next(new AppError(400, "Content required"));
  try {
    const summary = await aiService.summarize(content);
    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
};

export const recommendTags = async (req: Request, res: Response, next: NextFunction) => {
  const { content } = req.body;
  if (!content) return next(new AppError(400, "Content required"));
  try {
    const tags = await aiService.recommendTags(content);
    res.status(200).json({ tags });
  } catch (error) {
    next(error);
  }
};

export const aiChat = async (req: Request, res: Response, next: NextFunction) => {
  const { query, blogId } = req.body;
  if (!query) return next(new AppError(400, "Query required"));
  try {
    let context = "";
    if (blogId) {
      const blog = await prisma.blog.findUnique({ where: { id: blogId } });
      if (!blog) return next(new AppError(404, "Blog not found"));
      if (blog.status !== "PUBLISHED" && blog.authorId !== req.user?.id) return next(new AppError(403, "Not authorized"));
      context = blog.content;
    }
    const response = await aiService.chat(query, context);
    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};