import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AuthProLogo,
  CheckCircleFillIcon,
  LockKeyholeIcon,
  GearIcon,
  LightningIcon,
} from "./AuthProIcons";

export function TopBadgesBar() {
  return (
    <div className="w-full bg-white/70 backdrop-blur-sm border-b border-slate-200/60 py-2 hidden lg:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">Advanced Authentication System</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-medium">Secure • Modern • User-Friendly</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
            <CheckCircleFillIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>Multi-Factor Authentication</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
            <LockKeyholeIcon className="w-3.5 h-3.5 text-blue-500" />
            <span>Secure Sessions & Device Management</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200/60">
            <GearIcon className="w-3.5 h-3.5 text-sky-500" />
            <span>Account Settings & Privacy Control</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
            <LightningIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Passwordless (Optional)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GuestNavbar() {
  const location = useLocation();

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="focus:outline-none">
          <AuthProLogo size="md" />
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
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

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
