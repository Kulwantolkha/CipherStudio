
import React, { useMemo, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const SandpackEditor = ({ projectId, files }) => {
  const { axios } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [localFiles, setLocalFiles] = useState(files);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [creatingFile, setCreatingFile] = useState(false);

  React.useEffect(() => {
    setLocalFiles(files);
  }, [files]);

  const byId = useMemo(() => {
    const m = new Map();
    (localFiles || []).forEach((f) => m.set(f._id, f));
    return m;
  }, [localFiles]);

  const getFilePath = (file) => {
    const parts = [file.name];
    let cur = file;
    while (cur.parentId) {
      const parent = byId.get(cur.parentId);
      if (!parent) break;
      parts.unshift(parent.name);
      cur = parent;
    }
    return "/" + parts.join("/");
  };

  const sandpackFiles = useMemo(() => {
    const out = {};
    const codeFiles = localFiles?.filter((f) => f.type === "file") || [];

    for (const f of codeFiles) {
      out[getFilePath(f)] = { code: f.content || "" };
    }

    if (Object.keys(out).length === 0) {
      out["/App.js"] = {
        code: `export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Welcome to CipherStudio!</h1>
      <p>Start editing to see live changes.</p>
    </div>
  );
}`,
      };
      out["/index.js"] = {
        code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
      };
    }
    return out;
  }, [localFiles, byId]);

  const saveAll = async (currentFiles) => {
    try {
      setSaving(true);

      const pathMap = new Map();
      for (const f of localFiles || []) {
        if (f.type === "file") pathMap.set(getFilePath(f), f);
      }

      const updates = [];
      for (const [path, { code }] of Object.entries(currentFiles)) {
        const doc = pathMap.get(path);
        if (doc && doc.content !== code) {
          updates.push(axios.put(`/api/files/${doc._id}`, { content: code }));
        }
      }

      if (updates.length === 0) {
        toast.success("No changes to save");
        return;
      }

      await Promise.all(updates);
      toast.success("All files saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save files");
    } finally {
      setSaving(false);
    }
  };

  const deleteFile = async (fileId, fileName) => {
    if (!confirm(`Delete "${fileName}"?`)) return;

    try {
      const { data } = await axios.delete(`/api/files/${fileId}`);
      if (data.success) {
        toast.success("File deleted");
        setLocalFiles((prev) => prev.filter((f) => f._id !== fileId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const createNewFile = async () => {
    if (!newFileName.trim()) {
      toast.error("File name is required");
      return;
    }

    try {
      setCreatingFile(true);

      const ext = newFileName.split(".").pop().toLowerCase();

      let content = "";
      let language = "javascript";

      if (ext === "jsx" || ext === "tsx") {
        const componentName = newFileName.split(".")[0];
        content = `export default function ${componentName}() {\n  return <div>${componentName} Component</div>;\n}\n`;
        language = "jsx";
      } else if (ext === "js") {
        content = `// ${newFileName}\n`;
        language = "javascript";
      } else if (ext === "css") {
        content = `/* ${newFileName} */\n`;
        language = "css";
      } else if (ext === "html") {
        content = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${newFileName}</title>\n</head>\n<body>\n  \n</body>\n</html>`;
        language = "html";
      } else if (ext === "json") {
        content = `{\n  \n}\n`;
        language = "json";
      }

      const payload = {
        projectId,
        name: newFileName.trim(),
        type: "file",
        content,
        language,
        parentId: null,
      };

      const { data } = await axios.post("/api/files", payload);

      if (data.success) {
        toast.success(`File "${newFileName}" created`);
        setLocalFiles((prev) => [...prev, data.file]);
        setShowCreateModal(false);
        setNewFileName("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create file");
      console.error(err);
    } finally {
      setCreatingFile(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* ✅ Create File Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Create New File</h3>
            <input
              type="text"
              placeholder="Enter file name (e.g., Button.jsx)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && createNewFile()}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="text-xs text-gray-500 mb-4">
              Supported: .js, .jsx, .tsx, .css, .html, .json
            </div>
            <div className="flex gap-2">
              <button
                onClick={createNewFile}
                disabled={creatingFile || !newFileName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingFile ? "Creating..." : "Create"}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewFileName("");
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File List with Actions */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-semibold">
            Files ({localFiles?.length || 0})
          </span>
          {/* ✅ New File Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-xs"
          >
            + New File
          </button>
        </div>

        <details open>
          <summary className="cursor-pointer text-gray-400 text-xs">
            Click to expand
          </summary>
          <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
            {localFiles?.map((f) => (
              <div
                key={f._id}
                className="flex items-center justify-between text-xs py-1 hover:bg-gray-700 px-2 rounded"
              >
                <span className="text-gray-300">{f.name}</span>
                <button
                  onClick={() => deleteFile(f._id, f.name)}
                  className="text-red-400 hover:text-red-300 px-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </details>
      </div>

      <SandpackProvider
        template="react"
        files={sandpackFiles}
        theme="dark"
        options={{ autorun: true, autoReload: true }}
      >
        <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
          <span className="text-white text-sm">Sandpack Live Editor</span>
          <SandpackConsumerToolbar onSave={saveAll} saving={saving} />
        </div>

        <SandpackLayout style={{ height: "100%" }}>
          <SandpackCodeEditor
            style={{ height: "100%" }}
            showTabs
            showLineNumbers
            showInlineErrors
            wrapContent
            closableTabs
          />
          <SandpackPreview
            style={{ height: "100%" }}
            showNavigator
            showRefreshButton
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

const SandpackConsumerToolbar = ({ onSave, saving }) => {
  const { sandpack } = useSandpack();
  return (
    <button
      onClick={() => onSave(sandpack.files)}
      disabled={saving}
      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save All"}
    </button>
  );
};

export default SandpackEditor;