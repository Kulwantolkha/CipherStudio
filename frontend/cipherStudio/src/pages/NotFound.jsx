import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Page not found</p>
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Go Home
      </button>
    </div>
  );
}
