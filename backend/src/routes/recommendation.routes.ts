// src/routes/recommendation.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { getForYou, getFollowing, getLatest, getCustom, markRecommendationClicked } from "../controller/recommendation.controller";

router.get("/for-you", verifyUser, getForYou);
router.get("/following", verifyUser, getFollowing);
router.get("/latest", getLatest);
router.get("/custom/:sectionId", verifyUser, getCustom);
router.post("/:recommendationId/click", verifyUser, markRecommendationClicked);

export default router;