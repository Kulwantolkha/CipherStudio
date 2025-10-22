import mongoose from "mongoose";
import File from "../models/files.model.js";
import Project from "../models/project.model.js";

const verifyProjectOwnership = async (projectId, userId) => {
  if (!mongoose.isValidObjectId(projectId)) {
    return { valid: false, status: 400, error: "Invalid project ID" };
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return { valid: false, status: 404, error: "Project not found" };
  }
  if (!userId) {
    return { valid: false, status: 401, error: "Unauthorized" };
  }
  if (project.userId && project.userId.toString() !== String(userId)) {
    return { valid: false, status: 403, error: "Forbidden" };
  }
  return { valid: true, project };
};

export const createFile = async (req, res) => {
  try {
    const { projectId, parentId, name, type, content, language } = req.body;

    if (!projectId) {
      return res.status(400).json({ success: false, message: "projectId is required" });
    }
    if (!name) {
      return res.status(400).json({ success: false, message: "name is required" });
    }
    
    if (!type || !["file", "folder"].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: "type must be 'file' or 'folder'" 
      });
    }

    const ownership = await verifyProjectOwnership(projectId, req.user?._id);
    if (!ownership.valid) {
      return res.status(ownership.status).json({ 
        success: false, 
        message: ownership.error 
      });
    }

    if (parentId) {
      if (!mongoose.isValidObjectId(parentId)) {
        return res.status(400).json({ success: false, message: "Invalid parentId" });
      }
      const parent = await File.findById(parentId);
      if (!parent) {
        return res.status(404).json({ success: false, message: "Parent folder not found" });
      }
      if (parent.type !== "folder") {
        return res.status(400).json({ success: false, message: "Parent must be a folder" });
      }
      if (parent.projectId.toString() !== projectId) {
        return res.status(400).json({ 
          success: false, 
          message: "Parent folder belongs to different project" 
        });
      }
    }

    const duplicate = await File.findOne({
      projectId,
      parentId: parentId || null,
      name,
    });
    if (duplicate) {
      return res.status(400).json({ 
        success: false, 
        message: `A ${type} with name "${name}" already exists in this location` 
      });
    }

    const fileData = {
      projectId,
      parentId: parentId || null,
      name,
      type,
    };

    if (type === "file") {
      fileData.content = content || "";
      fileData.language = language || detectLanguage(name);
      fileData.sizeInBytes = Buffer.byteLength(fileData.content, "utf8");
    }

    const file = await File.create(fileData);

    return res.status(201).json({ success: true, file });
  } catch (err) {
    console.error("createFile error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const detectLanguage = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const languageMap = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    css: "css",
    scss: "scss",
    html: "html",
    json: "json",
    md: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    sql: "sql",
    sh: "shell",
  };
  return languageMap[ext] || "plaintext";
};

export const getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;

    const ownership = await verifyProjectOwnership(projectId, req.user?._id);
    if (!ownership.valid) {
      return res.status(ownership.status).json({ 
        success: false, 
        message: ownership.error 
      });
    }

    const files = await File.find({ projectId }).sort({ type: -1, name: 1 });
    return res.json({ success: true, files });
  } catch (err) {
    console.error("getProjectFiles error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFolderContents = async (req, res) => {
  try {
    const { folderId } = req.params;

    if (!mongoose.isValidObjectId(folderId)) {
      return res.status(400).json({ success: false, message: "Invalid folder ID" });
    }

    const folder = await File.findById(folderId);
    if (!folder) {
      return res.status(404).json({ success: false, message: "Folder not found" });
    }
    if (folder.type !== "folder") {
      return res.status(400).json({ success: false, message: "Not a folder" });
    }

    const ownership = await verifyProjectOwnership(folder.projectId, req.user?._id);
    if (!ownership.valid) {
      return res.status(ownership.status).json({ 
        success: false, 
        message: ownership.error 
      });
    }

    const contents = await File.find({ parentId: folderId }).sort({ type: -1, name: 1 });
    return res.json({ success: true, contents });
  } catch (err) {
    console.error("getFolderContents error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid file ID" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const ownership = await verifyProjectOwnership(file.projectId, req.user?._id);
    if (!ownership.valid) {
      return res.status(ownership.status).json({ 
        success: false, 
        message: ownership.error 
      });
    }

    return res.json({ success: true, file });
  } catch (err) {
    console.error("getFileById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, parentId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid file ID" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const ownership = await verifyProjectOwnership(file.projectId, req.user?._id);
    if (!ownership.valid) {
      return res.status(ownership.status).json({ 
        success: false, 
        message: ownership.error 
      });
    }

    if (name && name !== file.name) {
      const duplicate = await File.findOne({
        projectId: file.projectId,
        parentId: file.parentId,
        name,
        _id: { $ne: id },
      });
      if (duplicate) {
        return res.status(400).json({ 
          success: false, 
          message: "Name already exists in this location" 
        });
      }
      file.name = name;
      if (file.type === "file") {
        file.language = detectLanguage(name);
      }
    }

    if (content !== undefined && file.type === "file") {
      file.content = content;
      file.sizeInBytes = Buffer.byteLength(content, "utf8");
    }

    if (parentId !== undefined) {
      if (parentId && !mongoose.isValidObjectId(parentId)) {
        return res.status(400).json({ success: false, message: "Invalid parentId" });
      }
      if (parentId) {
        const parent = await File.findById(parentId);
        if (!parent || parent.type !== "folder") {
          return res.status(400).json({ 
            success: false, 
            message: "Invalid parent folder" 
          });
        }
      }
      file.parentId = parentId || null;
    }

    await file.save();
    return res.json({ success: true, file });
  } catch (err) {
    console.error("updateFile error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid file ID" });
    }

    const file = await File.findById(id);
    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const ownership = await verifyProjectOwnership(file.projectId, req.user?._id);
    if (!ownership.valid) {
      return res.status(ownership.status).json({ 
        success: false, 
        message: ownership.error 
      });
    }

    if (file.type === "folder") {
      await deleteRecursive(id);
    }

    await file.deleteOne();

    return res.json({ 
      success: true, 
      message: `${file.type} deleted successfully` 
    });
  } catch (err) {
    console.error("deleteFile error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteRecursive = async (folderId) => {
  const children = await File.find({ parentId: folderId });
  for (const child of children) {
    if (child.type === "folder") {
      await deleteRecursive(child._id);
    }
    await child.deleteOne();
  }
};