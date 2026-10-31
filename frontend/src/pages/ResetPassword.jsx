import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from "../components/Icons";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const tokenFromUrl = searchParams.get("token") || "";
  const [token, setToken] = useState(tokenFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passChecks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };

  const isPasswordStrong = Object.values(passChecks).every(Boolean);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Please ensure your new password satisfies all 5 security requirements.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password. The link may have expired.");
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
            <LockIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Set New Password
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Choose a strong master password for your account
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
                <p className="font-semibold">Password Reset Successful!</p>
                <p className="text-xs text-emerald-300/80 mt-1">
                  All active sessions were safely revoked. Redirecting you to sign in...
                </p>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              Sign In Now <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {!tokenFromUrl && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Reset Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste reset token"
                    required
                    className="w-full glass-input text-white text-sm pl-11 pr-4 py-3 rounded-xl placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  required
                  className="w-full glass-input text-white text-sm pl-11 pr-11 py-3 rounded-xl placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
              <div className={`flex items-center gap-1.5 ${passChecks.length ? "text-emerald-400" : "text-slate-400"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${passChecks.length ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>✓</span>
                <span>8+ characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passChecks.upper ? "text-emerald-400" : "text-slate-400"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${passChecks.upper ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>✓</span>
                <span>Uppercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passChecks.lower ? "text-emerald-400" : "text-slate-400"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${passChecks.lower ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>✓</span>
                <span>Lowercase letter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${passChecks.number ? "text-emerald-400" : "text-slate-400"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${passChecks.number ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>✓</span>
                <span>At least 1 number</span>
              </div>
              <div className={`col-span-2 flex items-center gap-1.5 ${passChecks.special ? "text-emerald-400" : "text-slate-400"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${passChecks.special ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>✓</span>
                <span>Special character (@$!%*?&)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Updating Password..." : "Update Master Password"}
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
          <span>Automatic Session Revocation on Reset</span>
        </div>
      </div>
    </div>
  );
}
