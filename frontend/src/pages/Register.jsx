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
  CheckIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
} from "../components/Icons";

export default function Register() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live password validation checks
  const passChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const validCount = Object.values(passChecks).filter(Boolean).length;
  const isPasswordStrong = validCount === 5;

  // Strength score
  let strengthLabel = "Too Weak";
  let strengthColor = "bg-rose-500";
  let strengthTextColor = "text-rose-400";
  if (validCount >= 5) {
    strengthLabel = "Excellent";
    strengthColor = "bg-emerald-500";
    strengthTextColor = "text-emerald-400";
  } else if (validCount >= 3) {
    strengthLabel = "Good";
    strengthColor = "bg-indigo-500";
    strengthTextColor = "text-indigo-400";
  } else if (validCount >= 2) {
    strengthLabel = "Fair";
    strengthColor = "bg-amber-500";
    strengthTextColor = "text-amber-400";
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordStrong) {
      setError("Please ensure your password fulfills all 5 security requirements.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.join(", "));
      } else {
        setError(detail || "Registration failed. Please try again.");
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
      setError("Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-6 sm:pt-10">
      <div className="glass-panel p-8 sm:p-10 rounded-2xl relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
            <ShieldCheckIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Join NexusAuth with zero-knowledge encryption
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl text-sm flex items-start gap-3 bg-rose-950/40 border border-rose-500/40 text-rose-200">
            <AlertTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
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
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <LockIcon className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create strong password"
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

          {/* Dynamic Strength Bar */}
          {password && (
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Password Strength:</span>
                <span className={`font-semibold ${strengthTextColor}`}>{strengthLabel}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-all duration-300 ${
                      validCount >= step + (step === 4 ? 1 : 0) ? strengthColor : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>

              {/* Requirement Pills */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px]">
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
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Creating your account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
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
              or register with
            </span>
          </div>
        </div>

        {/* Google OAuth Register */}
        <div className="flex justify-center">
          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google registration failed")}
              theme="filled_black"
              shape="circle"
            />
          </div>
        </div>

        {/* Sign in footer link */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>

        {/* Security Assurance Badge */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
          <span>Bcrypt Salting • Rate Limiting Active</span>
        </div>
      </div>
    </div>
  );
}
