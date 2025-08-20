// src/app.ts
require("dotenv").config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import blogRoutes from "./routes/blogs.routes";
import commentRoutes from "./routes/comment.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import trendingRoutes from "./routes/trending.routes";
import aiRoutes from "./routes/ai.routes";
import customRoutes from "./routes/custom.routes";
import notificationRoutes from "./routes/notification.routes";
import progressRoutes from "./routes/progress.routes";
import { resendWebhookHandler } from "./controller/webhooks.controller";
import { cleanupHandler } from "./controller/cleanup.controller";
import chalk from "chalk";

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/recommendation", recommendationRoutes);
app.use("/api/v1/trending", trendingRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/custom", customRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/progress", progressRoutes);
app.post("/api/webhooks/resend", resendWebhookHandler);
app.delete("/api/cron/cleanup", cleanupHandler);

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`${chalk.green(`Started Backend on port ${PORT}`)}`);
});