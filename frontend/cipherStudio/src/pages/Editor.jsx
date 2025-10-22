import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import SandpackEditor from "../components/SandpackEditor";

export default function Editor() {
  const { projectId } = useParams();
  const { axios, user } = useAppContext();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const isValidId = /^[a-f\d]{24}$/i.test(projectId);
    if (!isValidId) {
      toast.error("Invalid project id");
      navigate("/");
      return;
    }
    load();
  }, [projectId, user]);

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, fRes] = await Promise.all([
        axios.get(`/api/projects/${projectId}`),
        axios.get(`/api/files/project/${projectId}`),
      ]);
      if (!pRes.data?.success) throw new Error("Failed to load project");
      setProject(pRes.data.project);
      setFiles(Array.isArray(fRes.data?.files) ? fRes.data.files : []);
    } catch (e) {
      console.error("Editor load error:", e);
      toast.error(e.response?.data?.message || "Failed to load project");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-300">
        Please login…
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold">{project?.name}</h2>
          <p className="text-gray-400 text-xs">{project?.projectSlug}</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <SandpackEditor projectId={projectId} files={files} />
      </div>
    </div>
  );
}
