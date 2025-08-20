// src/routes/user.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { getProfile, updateProfile, getFollowers, getFollowing, followUser, unfollowUser, getUserReach, getUserAnalytics, getMe } from "../controller/user.controller";
router.get("/profile/me", verifyUser, getMe);
router.get("/profile/:userId", getProfile);
router.put("/profile", verifyUser, updateProfile);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.post("/follow/:targetUserId", verifyUser, followUser);
router.delete("/follow/:targetUserId", verifyUser, unfollowUser);
router.get("/reach", verifyUser, getUserReach);
router.get("/analytics", verifyUser, getUserAnalytics);

export default router;