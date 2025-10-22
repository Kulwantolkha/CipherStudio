import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, axios, setShowLogin } = useAppContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/projects/user/me");
      if (data.success) setProjects(data.projects);
    } catch (e) {
      console.error("Load projects error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadProjects();
    else setLoading(false);
  }, [user]);

  const createProject = async () => {
    const name = prompt("Project name:");
    if (!name) return;
    try {
      const { data } = await axios.post("/api/projects", {
        name: name.trim(),
        description: "",
        settings: { framework: "react", autoSave: true },
      });
      if (data.success) navigate(`/editor/${data.project._id}`);
    } catch (e) {
      alert("Failed to create project");
    }
  };
  
  const deleteProject = async (projectId, projectName) => {
    if (!confirm(`Delete "${projectName}"? This cannot be undone.`)) return;

    try {
      const { data } = await axios.delete(`/api/projects/${projectId}`);
      if (data.success) {
        alert("Project deleted");
        setProjects(projects.filter((p) => p._id !== projectId));
      }
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">Welcome to CipherStudio</h1>
        <p className="text-gray-600">
          Login to create and manage your projects.
        </p>
        <button
          onClick={() => setShowLogin(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">My Projects</h2>
          <p className="text-sm text-gray-500">{projects.length} total</p>
        </div>
        <button
          onClick={createProject}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          No projects yet. Create your first project.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p._id} className="p-4 border rounded bg-white">
              <div
                onClick={() => navigate(`/editor/${p._id}`)}
                className="cursor-pointer"
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">{p.projectSlug}</div>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(p.updatedAt).toLocaleString()}
                </div>
              </div>

              {/* ✅ Add delete button */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => navigate(`/editor/${p._id}`)}
                  className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Open
                </button>
                <button
                  onClick={() => deleteProject(p._id, p.name)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
