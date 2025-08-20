// src/routes/notification.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { getNotifications, markRead } from "../controller/notification.controller";

router.get("/", verifyUser, getNotifications);
router.post("/:notificationId/read", verifyUser, markRead);

export default router;