import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || null;
  const data = err.data || null;

  console.log(
    chalk.bgRed.white.bold(" ERROR "),
    chalk.red(`→ [${req.method}] ${req.url}`),
    "\n",
    chalk.bgYellow.white.bold(` Status: `), chalk.yellowBright(statusCode),
    "\n",
    chalk.bgMagenta.white.bold(` Message: `), chalk.magentaBright(message),
    "\n",
    chalk.bgCyan.white.bold(` Code: `), chalk.cyan(code || "N/A"),
    "\n",
    chalk.gray(err.stack)
  );

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(code && { code }),
    ...(data && { data }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
