import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LaptopIcon,
  SmartphoneIcon,
  GlobeIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  TrashIcon,
  RefreshCwIcon,
  ClockIcon,
} from "../components/Icons";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);
  const [revokingId, setRevokingId] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/sessions");
      setSessions(response.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      setError("Unable to load active sessions.");
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (id) => {
    setRevokingId(id);
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to revoke session", err);
    } finally {
      setRevokingId(null);
    }
  };

  const revokeAllOtherSessions = async () => {
    try {
      await api.delete("/sessions");
      setConfirmRevokeAll(false);
      loadSessions();
    } catch (err) {
      console.error("Failed to revoke other sessions", err);
    }
  };

  const getDeviceIcon = (deviceLabel = "") => {
    const d = deviceLabel.toLowerCase();
    if (d.includes("iphone") || d.includes("ipad") || d.includes("android")) {
      return <SmartphoneIcon className="w-5 h-5 text-indigo-400" />;
    }
    if (d.includes("windows") || d.includes("macos") || d.includes("linux") || d.includes("chrome") || d.includes("desktop")) {
      return <LaptopIcon className="w-5 h-5 text-indigo-400" />;
    }
    return <GlobeIcon className="w-5 h-5 text-indigo-400" />;
  };

  const otherSessionsExist = sessions.some((s) => !s.current);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Active Session Isolation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Active Devices & Sessions
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Review and terminate active client connections linked to your account.
          </p>
        </div>

        <button
          onClick={loadSessions}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
          title="Refresh active sessions"
        >
          <RefreshCwIcon className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-xs bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2">
          <AlertTriangleIcon className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Global Actions Card */}
      {otherSessionsExist && (
        <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-rose-500/20 bg-rose-950/10">
          <div>
            <h4 className="font-semibold text-rose-300 text-sm">Terminate Remote Sessions</h4>
            <p className="text-xs text-rose-200/70">
              Revoke authentication tokens across all other devices except your current session.
            </p>
          </div>

          {confirmRevokeAll ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={revokeAllOtherSessions}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md shadow-rose-600/30"
              >
                Yes, Revoke All
              </button>
              <button
                onClick={() => setConfirmRevokeAll(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRevokeAll(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Revoke All Other Sessions</span>
            </button>
          )}
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {loading ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 text-sm space-y-3">
            <RefreshCwIcon className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
            <p>Scanning active session registry...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center text-slate-400 text-sm">
            No active sessions found.
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                session.current
                  ? "bg-slate-900/80 border-indigo-500/40 shadow-lg shadow-indigo-950/40"
                  : session.is_suspicious
                  ? "bg-amber-950/20 border-amber-500/40"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex-shrink-0">
                  {getDeviceIcon(session.device)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white text-sm">
                      {session.device || "Unknown Device"}
                    </h3>

                    {session.current && (
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CURRENT DEVICE
                      </span>
                    )}

                    {session.is_suspicious && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <AlertTriangleIcon className="w-3 h-3 text-amber-400" />
                        SUSPICIOUS LOGIN
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="font-mono text-slate-300">IP: {session.ip_address || "127.0.0.1"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <ClockIcon className="w-3 h-3 text-slate-400" />
                      Active: {new Date(session.last_used_at).toLocaleTimeString()} ({new Date(session.last_used_at).toLocaleDateString()})
                    </span>
                  </div>
                </div>
              </div>

              {!session.current && (
                <button
                  onClick={() => revokeSession(session.id)}
                  disabled={revokingId === session.id}
                  className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-500/30 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>{revokingId === session.id ? "Revoking..." : "Revoke Session"}</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
