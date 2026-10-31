import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function TopMasterHeader() {
  const location = useLocation();

  const screens = [
    { num: 1, name: "Landing Page (Guest)", path: "/" },
    { num: 2, name: "Login Page", path: "/login" },
    { num: 3, name: "Sign Up Page", path: "/register" },
    { num: 4, name: "2FA Verification", path: "/2fa" },
    { num: 5, name: "Forgot Password", path: "/forgot-password" },
    { num: 6, name: "Reset Password", path: "/reset-password" },
    { num: 7, name: "Email Verification", path: "/verify-email" },
    { num: 8, name: "Dashboard (After Login)", path: "/dashboard" },
    { num: 9, name: "Security Settings", path: "/security" },
    { num: 10, name: "Session Management", path: "/sessions" },
    { num: 11, name: "Privacy Settings", path: "/privacy" },
    { num: 12, name: "Account Settings", path: "/settings" },
  ];

  return (
    <div className="w-full bg-[#f1f5f9] border-b border-slate-200/80 select-none">
      {/* Top Infographic Master Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left: Master Branding with Big Purple Shield */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Big Purple Shield with White Padlock */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] flex items-center justify-center shadow-lg shadow-purple-500/25 flex-shrink-0">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                Advanced Authentication System
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1.5 flex items-center gap-2">
                <span>Secure</span>
                <span className="text-slate-400">•</span>
                <span>Modern</span>
                <span className="text-slate-400">•</span>
                <span>User-Friendly</span>
              </p>
            </div>
          </div>

          {/* Right: 4 Pill Cards matching the infographic top right */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Pill 1: Multi-Factor Authentication */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-xs px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                <div>Multi-Factor</div>
                <div className="text-slate-500 font-normal">Authentication</div>
              </div>
            </div>

            {/* Pill 2: Secure Sessions & Device Management */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-xs px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                <div>Secure Sessions</div>
                <div className="text-slate-500 font-normal">& Device Management</div>
              </div>
            </div>

            {/* Pill 3: Account Settings & Privacy Control */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-xs px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </div>
              <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                <div>Account Settings</div>
                <div className="text-slate-500 font-normal">& Privacy Control</div>
              </div>
            </div>

            {/* Pill 4: Passwordless (Optional) */}
            <div className="bg-white/95 rounded-2xl border border-slate-200/90 shadow-xs px-3 py-2 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center flex-shrink-0 shadow-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                <div>Passwordless</div>
                <div className="text-slate-500 font-normal">(Optional)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Screens Navigator Bar */}
      <div className="bg-white/90 border-t border-slate-200/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-2 flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mr-1">
            Screens:
          </span>
          {screens.map((s) => {
            const isActive = location.pathname === s.path;
            return (
              <Link
                key={s.num}
                to={s.path}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
                }`}
              >
                {s.num}. {s.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
