import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import {
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from "../components/Icons";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Rate limit exceeded. Too many requests, please wait 1 minute before trying again.");
      } else {
        const detail = err.response?.data?.detail;
        if (typeof detail === "string") {
          setError(detail);
        } else if (Array.isArray(detail)) {
          setError(detail.map((d) => d.msg || d).join(", "));
        } else {
          setError("Invalid email or password.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      setError("");
      setLoading(true);
      await googleLogin(response.credential);
      navigate("/dashboard");
    } catch (err) {
      setError("Google authentication failed. Please try again or use email/password.");
    } finally {
      setLoading(false);
    }
  };

  const isLockedOrThrottled =
    error.includes("locked") || error.includes("Rate limit") || error.includes("minute");

  return (
    <div className="max-w-md mx-auto pt-6 sm:pt-10">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl relative overflow-hidden">
        {/* Subtle decorative glowing aura */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
            <LockIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Sign in to access your secure command center
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className={`mb-6 p-3.5 rounded-xl text-sm flex items-start gap-3 border ${
              isLockedOrThrottled
                ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
                : "bg-rose-950/40 border-rose-500/40 text-rose-200"
            }`}
          >
            <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-current" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LockIcon className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          {/* Remember me option */}
          <div className="flex items-center pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
              />
              <span>Keep me signed in for 7 days</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-slate-900 text-slate-400 uppercase tracking-wider font-medium">
              or continue with
            </span>
          </div>
        </div>

        {/* Google OAuth Login */}
        <div className="flex justify-center">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google authentication failed")}
              theme="filled_black"
              shape="circle"
            />
          </div>
        </div>

        {/* Register footer link */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create an account
          </Link>
        </p>

        {/* Security Assurance Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
          <span>256-bit TLS Encryption • Multi-Session Isolation</span>
        </div>
      </div>
    </div>
  );
}
