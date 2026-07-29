import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };


  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link
        to={token ? "/dashboard" : "/login"}
        className="font-bold text-xl text-blue-600"
      >
        SecureAuth App
      </Link>

      <div className="space-x-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className={`${
                location.pathname === "/login"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`px-4 py-2 rounded text-white ${
                location.pathname === "/register"
                  ? "bg-blue-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={`${
                location.pathname === "/dashboard"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Dashboard
            </Link>

            <Link
              to="/sessions"
              className={`${
                location.pathname === "/sessions"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              } hover:text-blue-600`}
            >
              Active Sessions
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}