// src/routes/progress.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { updateProgress, getProgress } from "../controller/progress.controller";

router.put("/:blogId", verifyUser, updateProgress);
router.get("/:blogId", verifyUser, getProgress);

export default router;