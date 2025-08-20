// src/routes/comment.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { createComment, updateComment, deleteComment, listComments } from "../controller/comment.controller";

router.post("/:blogId", verifyUser, createComment);
router.put("/:commentId", verifyUser, updateComment);
router.delete("/:commentId", verifyUser, deleteComment);
router.get("/:blogId", listComments);

export default router;