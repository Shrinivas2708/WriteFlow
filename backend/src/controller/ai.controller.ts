// src/controller/ai.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";
import { aiService } from "../services/aiService";
import { pineconeService } from "../services/pineConeService";

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
  try {
    let context = "";
    let queryEmbedding = await aiService.generateEmbedding(query);
    const similar = await pineconeService.querySimilarBlogs(queryEmbedding, 5, { status: 'PUBLISHED' });
    context = similar.map(s => `Blog ID: ${s.id}, Content snippet: ...`).join('\n'); // Fetch actual content from Prisma
    const response = await aiService.chat(query, context);
    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};