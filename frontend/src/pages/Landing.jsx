import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GuestNavbar from "../components/GuestNavbar";
import { IsometricSecurityArtwork } from "../components/AuthProIcons";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans select-none">
      {/* Page Content with Balanced Left/Right Padding and Margin */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex-1 flex flex-col justify-center">
        {/* Screen 1: Landing Page (Guest) Framed Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden flex flex-col">
          {/* Inner Landing Card Header (Screen 1 Header) */}
          <GuestNavbar />

          {/* Hero Section inside Card with Refined Left/Right Padding */}
          <div className="px-6 sm:px-10 lg:px-14 py-10 sm:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Headline, Subtitle, CTAs & Social Proof */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                    Your Account, <br />
                    <span className="text-indigo-600">More Secure</span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-md mx-auto lg:mx-0">
                    Sign in, verify, and stay in control with advanced authentication.
                  </p>
                </div>

                {/* Buttons: Get Started & Learn More */}
                <div className="flex flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link
                    to={isAuthenticated ? "/dashboard" : "/register"}
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-sm shadow-indigo-600/20 transition-all text-center cursor-pointer"
                  >
                    Get Started
                  </Link>
                  <a
                    href="#features"
                    className="px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200/90 shadow-2xs transition-all text-center cursor-pointer"
                  >
                    Learn More
                  </a>
                </div>

                {/* Social Proof Avatar Stack */}
                <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"
                      alt="Avatar 1"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces"
                      alt="Avatar 2"
                    />
                    <img
                      className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                      alt="Avatar 3"
                    />
                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white bg-slate-900 text-[9px] font-bold text-white">
                      +50k
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Trusted by <strong className="text-slate-800 font-semibold">50K+ users</strong>
                  </span>
                </div>
              </div>

              {/* Right Column: 3D Isometric Pedestal Artwork */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end">
                <div className="w-full max-w-[400px]">
                  <IsometricSecurityArtwork />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Section */}
        <section id="features" className="mt-14 pt-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Enterprise Protection Built In
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              Multi-factor verification, device control, and granular privacy management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Two-Factor Auth</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                TOTP authenticators with 6-digit verification code defense.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Device Sessions</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Manage all connected devices and log out sessions instantly.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Privacy Controls</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Toggle profile visibility, marketing, and data telemetry.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Passwordless Ready</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Biometric and OAuth integrations designed for speed and security.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-400">
        <p>© 2026 AuthPro • Advanced Authentication System. All rights reserved.</p>
      </footer>
    </div>
  );
}
