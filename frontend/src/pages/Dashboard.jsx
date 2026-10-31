import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheckIcon,
  LockIcon,
  AlertTriangleIcon,
  LaptopIcon,
  UserIcon,
  KeyIcon,
  ActivityIcon,
  CheckCircleIcon,
  ClockIcon,
  RefreshCwIcon,
  EyeIcon,
  EyeOffIcon,
} from "../components/Icons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const passChecks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[@$!%*?&]/.test(newPassword),
  };
  const isNewPasswordValid = Object.values(passChecks).every(Boolean);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await api.get("/auth/activity");
      setActivityLogs(res.data);
    } catch (err) {
      console.error("Failed to load activity logs", err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!isNewPasswordValid) {
      setPasswordError("New password does not fulfill all security requirements.");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.put("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess(res.data.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      fetchActivity();
    } catch (err) {
      setPasswordError(err.response?.data?.detail || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatEventName = (type) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getEventBadge = (type) => {
    if (type.includes("SUCCESS") || type.includes("REGISTERED")) {
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    }
    if (type.includes("FAILED") || type.includes("LOCKED")) {
      return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    }
    if (type.includes("SUSPICIOUS") || type.includes("REVOKED")) {
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
    return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Suspicious Activity Warning Banner */}
      {user?.has_suspicious_activity && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg shadow-amber-950/30">
          <div className="flex items-start gap-3">
            <AlertTriangleIcon className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-300">Security Alert: Suspicious Login Detected</h4>
              <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5">
                A recent login originated from an unfamiliar IP address. Review and terminate any unrecognized devices.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/sessions")}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow cursor-pointer whitespace-nowrap"
          >
            Review Active Sessions
          </button>
        </div>
      )}

      {/* Top Hero Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Security Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Account Dashboard
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">
            Real-time identity verification, session isolation, and audit trail for your account.
          </p>
        </div>

        <div className="flex gap-3 relative w-full sm:w-auto">
          <button
            onClick={() => navigate("/sessions")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
          >
            <LaptopIcon className="w-4 h-4 text-indigo-400" />
            <span>Manage Sessions</span>
          </button>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Health Score */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold uppercase text-slate-400">Security Score</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                EXCELLENT
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold text-white">96</span>
              <span className="text-slate-400 text-sm">/ 100</span>
            </div>
            <p className="text-xs text-slate-400">
              Your account is guarded with bcrypt salt, rate-limiting, and multi-session isolation.
            </p>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-[96%]" />
          </div>
        </div>

        {/* Identity Details */}
        <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
            Identity Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-500 block">Primary Email</span>
              <span className="font-semibold text-slate-200">{user?.email || "Loading..."}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-500 block">Sign-in Provider</span>
              <span className="font-semibold text-indigo-400">
                {user?.google_id ? "Google OAuth 2.0" : "Master Password (Bcrypt)"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-500 block">Current IP Address</span>
              <span className="font-mono text-slate-300">{user?.last_login_ip || "127.0.0.1"}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-500 block">Account Status</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Active & Protected
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Password Change & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In-App Password Change */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <KeyIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Update Password</h2>
              <p className="text-xs text-slate-400">Change your master authentication password</p>
            </div>
          </div>

          {passwordError && (
            <div className="mb-4 p-3 rounded-xl text-xs flex items-center gap-2 bg-rose-950/40 border border-rose-500/40 text-rose-300">
              <AlertTriangleIcon className="w-4 h-4 flex-shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          {passwordSuccess && (
            <div className="mb-4 p-3 rounded-xl text-xs flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {user?.google_id && !user?.password ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <p>Your account is linked with Google OAuth 2.0. Password updates are managed directly through Google.</p>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <LockIcon className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full glass-input text-white text-xs pl-10 pr-10 py-2.5 rounded-xl placeholder-slate-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyIcon className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    required
                    className="w-full glass-input text-white text-xs pl-10 pr-4 py-2.5 rounded-xl placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              {/* Requirement Checklist */}
              {newPassword && (
                <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                  <div className={`flex items-center gap-1 ${passChecks.length ? "text-emerald-400" : "text-slate-400"}`}>
                    <span>{passChecks.length ? "✓" : "•"}</span> 8+ chars
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.upper ? "text-emerald-400" : "text-slate-400"}`}>
                    <span>{passChecks.upper ? "✓" : "•"}</span> Uppercase
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.lower ? "text-emerald-400" : "text-slate-400"}`}>
                    <span>{passChecks.lower ? "✓" : "•"}</span> Lowercase
                  </div>
                  <div className={`flex items-center gap-1 ${passChecks.number ? "text-emerald-400" : "text-slate-400"}`}>
                    <span>{passChecks.number ? "✓" : "•"}</span> Number
                  </div>
                  <div className={`col-span-2 flex items-center gap-1 ${passChecks.special ? "text-emerald-400" : "text-slate-400"}`}>
                    <span>{passChecks.special ? "✓" : "•"}</span> Symbol (@$!%*?&)
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
              >
                {passwordLoading ? "Updating..." : "Confirm Password Change"}
              </button>
            </form>
          )}
        </div>

        {/* Security Activity Audit Log */}
        <div className="glass-panel p-6 sm:p-7 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                <ActivityIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Security Timeline</h2>
                <p className="text-xs text-slate-400">Immutable audit log of recent account events</p>
              </div>
            </div>
            <button
              onClick={fetchActivity}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Refresh timeline"
            >
              <RefreshCwIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {loadingActivity ? (
              <p className="text-center text-xs text-slate-400 py-8">Loading security audit events...</p>
            ) : activityLogs.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-8">No recent activity logged.</p>
            ) : (
              activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] border ${getEventBadge(log.event_type)}`}>
                        {formatEventName(log.event_type)}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{log.device || "Unknown Device"}</p>
                    <p className="text-slate-400 font-mono text-[10px]">IP: {log.ip_address || "127.0.0.1"}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-400 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3 text-slate-400" />
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
