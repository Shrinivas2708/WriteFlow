// src/routes/custom.routes.ts
import express from "express";
const router = express.Router();
import { verifyUser } from "../middlewares/verifyUser";
import { createCustomSection, updateCustomSection, deleteCustomSection, listCustomSections } from "../controller/custom.controller";

router.post("/", verifyUser, createCustomSection);
router.put("/:sectionId", verifyUser, updateCustomSection);
router.delete("/:sectionId", verifyUser, deleteCustomSection);
router.get("/", verifyUser, listCustomSections);

export default router;