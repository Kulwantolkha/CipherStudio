import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { Link,useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, setShowLogin, logout } = useAppContext();
  const navigate = useNavigate();
  const handleLogout = () => {
      logout();
      navigate('/');
  };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link to="/">
        <h2 className="text-2xl font-bold mb-3 text-center text-gray-800 cursor-pointer">
          <span className="text-blue-600">
            <span className="text-amber-800 text-4xl">C</span>ipherStudio
          </span>
        </h2>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link to="/" className="hover:text-blue-600 transition">
          Home
        </Link>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={handleLogout} 
            className="cursor-pointer px-6 py-2 bg-red-500 hover:bg-red-600 transition text-white rounded-full"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
        >
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
