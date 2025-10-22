import express from "express"
import {protect} from "../middlewares/auth.middleware.js"
import {createProject, getProjectsForUser, getProjectById, updateProject, deleteProject} from "../controllers/project.controller.js"

const router = express.Router();

router.post("/",protect, createProject);
router.get("/user/:userId", protect, getProjectsForUser);
router.get("/:id",protect,getProjectById);
router.put("/:id",protect, updateProject);
router.delete("/:id",protect, deleteProject);

export default router;