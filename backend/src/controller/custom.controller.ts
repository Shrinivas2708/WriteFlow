// src/controller/custom.controller.ts
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import { AppError } from "../utils/AppError";

export const createCustomSection = async (req: Request, res: Response, next: NextFunction) => {
  const { name, tags } = req.body;
  if (!name || !tags?.length) return next(new AppError(400, "Name and tags required"));
  try {
    const section = await prisma.customSection.create({
      data: { userId: req.user?.id!, name, tags },
    });
    res.status(200).json({ sectionId: section.id });
  } catch (error) {
    next(error);
  }
};

export const updateCustomSection = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;
  const { name, tags } = req.body;
  try {
    const section = await prisma.customSection.findUnique({ where: { id: sectionId } });
    if (!section || section.userId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.customSection.update({
      where: { id: sectionId },
      data: { name, tags },
    });
    res.status(200).json({ message: "Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomSection = async (req: Request, res: Response, next: NextFunction) => {
  const { sectionId } = req.params;
  try {
    const section = await prisma.customSection.findUnique({ where: { id: sectionId } });
    if (!section || section.userId !== req.user?.id) return next(new AppError(403, "Not authorized"));
    await prisma.customSection.delete({ where: { id: sectionId } });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

export const listCustomSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sections = await prisma.customSection.findMany({ where: { userId: req.user?.id } });
    res.status(200).json({ sections });
  } catch (error) {
    next(error);
  }
};