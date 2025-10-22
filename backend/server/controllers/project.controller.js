import slugify from "slugify";
import { customAlphabet } from "nanoid";
import mongoose from "mongoose";
import Project from "../models/project.model.js";
import File from "../models/files.model.js";

const nano = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

const createDefaultFiles = async (projectId) => {
  const defaultFiles = [
    {
      projectId,
      parentId: null,
      name: "App.js",
      type: "file",
      content: `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Welcome to Your New Project!</h1>
      <p>Start editing to see live changes.</p>
    </div>
  );
}`,
      language: "jsx",
      sizeInBytes: 0,
    },
    {
      projectId,
      parentId: null,
      name: "index.js",
      type: "file",
      content: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
      language: "javascript",
      sizeInBytes: 0,
    },
  ];

  for (const fileData of defaultFiles) {
    fileData.sizeInBytes = Buffer.byteLength(fileData.content, "utf8");
    await File.create(fileData);
  }
};

const toBaseSlug = (text) => {
  const s = slugify(text ?? "", { lower: true, strict: true, trim: true });
  return s || "project";
};

const ensureUniqueSlug = async (base) => {
  let slug = base;
  let exists = await Project.exists({ projectSlug: slug });
  while (exists) {
    slug = `${base}-${nano()}`;
    exists = await Project.exists({ projectSlug: slug });
  }
  return slug;
};

export const createProject = async (req, res) => {
  try {
    const { name, description, projectSlug, settings } = req.body;

    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const base = toBaseSlug(projectSlug || name);
    const uniqueSlug = await ensureUniqueSlug(base);

    const userId = req.user?._id || null;

    const project = await Project.create({
      projectSlug: uniqueSlug,
      userId,
      name,
      description: description || "",
      settings: {
        framework: settings?.framework || "react",
        autoSave: settings?.autoSave ?? true,
      },
    });

    await createDefaultFiles(project._id);

    return res.json({ success: true, project });
  } catch (err) {
    console.error("createProject error: ", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjectsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    let targetUserId = userId;
    if (userId === "me") {
      if (!req.user?._id) return res.status(401).json({ success: false, message: "Unauthorized" });
      targetUserId = req.user._id.toString();
    }

    if (!mongoose.isValidObjectId(targetUserId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    if (!req.user || req.user._id.toString() !== targetUserId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const projects = await Project.find({ userId: targetUserId }).sort({ updatedAt: -1 });
    return res.json({ success: true, projects });
  } catch (err) {
    console.log("getProjectsForUser error: ", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.userId) {
      if (!req.user || req.user._id.toString() !== project.userId.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    }
    return res.json({ success: true, project });
  } catch (err) {
    console.error("getProjectById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, settings } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.userId) {
      if (!req.user || req.user._id.toString() !== project.userId.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    }

    if (name) project.name = name;
    if (typeof description === "string") project.description = description;
    if (settings) {
      if (!project.settings) project.settings = {};
      if (typeof settings.framework === "string") project.settings.framework = settings.framework;
      if (typeof settings.autoSave === "boolean") project.settings.autoSave = settings.autoSave;
    }

    await project.save();
    return res.json({ success: true, project });
  } catch (err) {
    console.error("updateProject error: ", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid project id" });
    }
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    if (project.userId) {
      if (!req.user || req.user._id.toString() !== project.userId.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    }

    await project.deleteOne();
    return res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    console.error("deleteProject error: ", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};