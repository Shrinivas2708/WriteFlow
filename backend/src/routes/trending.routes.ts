// src/routes/trending.routes.ts
import express from "express";
const router = express.Router();
import { getTrendingBlogs, getTrendingTags, getTrendingAuthors, updateTrendingScores } from "../controller/trending.controller";

router.get("/blogs", getTrendingBlogs);
router.get("/tags", getTrendingTags);
router.get("/authors", getTrendingAuthors);
router.post("/update-scores", updateTrendingScores); // For cron job

export default router;