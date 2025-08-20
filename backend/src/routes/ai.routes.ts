// src/routes/ai.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { generateCoverImage, summarizeBlog, recommendTags, aiChat } from "../controller/ai.controller";

router.post("/cover", verifyUser, generateCoverImage);
router.post("/summarize", verifyUser, summarizeBlog);
router.post("/tags", verifyUser, recommendTags);
router.post("/chat", verifyUser, aiChat);

export default router;