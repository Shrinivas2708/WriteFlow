import { NextFunction, Request, Response } from "express";

// utils/catchAsync.ts
export const catchAsync = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
