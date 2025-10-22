import express from "express";
import {protect} from "../middlewares/auth.middleware.js"
import { createFile,getProjectFiles,getFileById,updateFile,deleteFile,getFolderContents,
} from "../controllers/File.controller.js";

const router = express.Router();

router.post("/", protect, createFile);
router.get("/project/:projectId", protect, getProjectFiles);
router.get("/folder/:folderId", protect, getFolderContents);
router.get("/:id", protect, getFileById); 
router.put("/:id", protect, updateFile); 
router.delete("/:id", protect, deleteFile);

export default router;