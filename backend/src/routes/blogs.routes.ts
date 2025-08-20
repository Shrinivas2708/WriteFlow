// src/routes/blog.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { createBlog, updateBlog, deleteBlog, publishBlog, unpublishBlog, getBlog, listBlogs, viewBlog, likeBlog, unlikeBlog, shareBlog, bookmarkBlog, unbookmarkBlog, getBlogStats, getBlogAnalytics } from "../controller/blogs.controller";

router.post("/", verifyUser, createBlog);
router.put("/:blogId", verifyUser, updateBlog);
router.delete("/:blogId", verifyUser, deleteBlog);
router.post("/:blogId/publish", verifyUser, publishBlog);
router.post("/:blogId/unpublish", verifyUser, unpublishBlog);
router.get("/:blogId", getBlog);
router.get("/", listBlogs);
router.post("/:blogId/view", verifyUser, viewBlog);
router.post("/:blogId/like", verifyUser, likeBlog);
router.delete("/:blogId/like", verifyUser, unlikeBlog);
router.post("/:blogId/share", verifyUser, shareBlog);
router.post("/:blogId/bookmark", verifyUser, bookmarkBlog);
router.delete("/:blogId/bookmark", verifyUser, unbookmarkBlog);
router.get("/:blogId/stats", getBlogStats);
router.get("/:blogId/analytics", verifyUser, getBlogAnalytics);

export default router;