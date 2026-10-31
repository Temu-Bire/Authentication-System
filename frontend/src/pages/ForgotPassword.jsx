import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  KeyIcon,
  MailIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "../components/Icons";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [devToken, setDevToken] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(res.data.message || "Reset link dispatched.");
      if (res.data.reset_token) {
        setDevToken(res.data.reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-6 sm:pt-10">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
            <KeyIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Enter your account email to receive recovery instructions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl text-sm flex items-start gap-3 bg-rose-950/40 border border-rose-500/40 text-rose-200">
            <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3">
              <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <p className="font-semibold">{success}</p>
                <p className="text-xs text-emerald-300/80 mt-1">
                  Please check your inbox. The recovery link is valid for 30 minutes.
                </p>
              </div>
            </div>

            {devToken && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-xs space-y-2">
                <p className="font-semibold text-indigo-300">Quick Test Recovery Link:</p>
                <Link
                  to={`/reset-password?token=${devToken}`}
                  className="block text-indigo-400 hover:text-indigo-300 break-all underline"
                >
                  Click here to proceed to password reset page
                </Link>
              </div>
            )}

            <Link
              to="/login"
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full glass-input text-white text-sm pl-11 pr-4 py-3 rounded-xl placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Generating Link..." : "Send Reset Instructions"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                Remember your password? <span className="text-indigo-400 font-semibold">Sign In</span>
              </Link>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
          <span>Single-Use Cryptographic Recovery Tokens</span>
        </div>
      </div>
    </div>
  );
}
