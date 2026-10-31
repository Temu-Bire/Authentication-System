import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldCheckIcon, LogOutIcon, LaptopIcon, UserIcon } from "./Icons";

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                NexusAuth
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                SECURE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Zero-Knowledge Authentication Suite</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === "/login"
                    ? "text-white bg-slate-800/80"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-md shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50"
              >
                Create Account
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                  location.pathname === "/dashboard"
                    ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <Link
                to="/sessions"
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 relative transition-all ${
                  location.pathname === "/sessions"
                    ? "text-indigo-400 bg-indigo-500/10 border border-indigo-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <LaptopIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sessions</span>
                {user?.has_suspicious_activity && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                )}
              </Link>

              {/* User Chip */}
              {user && (
                <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">{user.email}</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> Verified
                    </p>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 sm:px-3 sm:py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all"
                title="Sign out of account"
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
