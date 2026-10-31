import React, { useState } from "react";
import { Link } from "react-router-dom";
import GuestNavbar, { TopBadgesBar } from "../components/GuestNavbar";
import { PaperPlaneMailArtwork } from "../components/AuthProIcons";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [devToken, setDevToken] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      if (res.data?.reset_token) {
        setDevToken(res.data.reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to dispatch reset link. Please verify your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <TopBadgesBar />
      <GuestNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Screen 5: Forgot Password Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/40 p-8 sm:p-10 text-center">
          {/* Paper Plane Mail Illustration */}
          <div className="flex justify-center mb-6">
            <PaperPlaneMailArtwork />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed max-w-xs mx-auto">
            Enter your email address and we'll send you a reset link.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs leading-relaxed">
                <p className="font-semibold text-sm mb-1">Check your inbox</p>
                We've sent password reset instructions to <strong>{email}</strong>.
              </div>

              {devToken && (
                <div className="p-3 bg-slate-50 border border-indigo-100 rounded-xl text-left text-xs">
                  <span className="font-semibold text-indigo-700">Quick Test Link:</span>
                  <Link
                    to={`/reset-password?token=${devToken}`}
                    className="block text-indigo-600 underline font-medium truncate mt-1"
                  >
                    Open Reset Password Screen →
                  </Link>
                </div>
              )}

              <Link
                to="/login"
                className="block w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
