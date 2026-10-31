import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthProLogo } from "./AuthProIcons";

export default function GuestNavbar() {
  const location = useLocation();

  return (
    <header className="w-full bg-white border-b border-slate-200/70 select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: AuthPro Logo */}
        <Link to="/" className="focus:outline-none flex-shrink-0">
          <AuthProLogo size="md" />
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-slate-600">
          <Link
            to="/"
            className={`${location.pathname === "/" ? "text-indigo-600 font-semibold" : "hover:text-slate-900"} transition-colors`}
          >
            Home
          </Link>
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#security" className="hover:text-slate-900 transition-colors">
            Security
          </a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Right: Compact Sign In Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
