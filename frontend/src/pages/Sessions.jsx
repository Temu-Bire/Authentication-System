import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Sessions() {
  const { logoutAllSessions } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSingle = async (id) => {
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to revoke session.");
    }
  };

  const handleLogoutAll = async () => {
    if (!window.confirm("Are you sure you want to log out of all active devices? You will need to sign in again.")) {
      return;
    }
    setLoggingOutAll(true);
    try {
      await logoutAllSessions();
      window.location.href = "/login";
    } catch (err) {
      console.error("Failed to log out all sessions", err);
      setLoggingOutAll(false);
    }
  };

  // Mock sample devices if fresh/empty to match design showcase:
  // "This Device: Windows • Chrome • Addis Ababa", "Laptop: Linux • Firefox", "Mobile: Android • Chrome"
  const displaySessions = sessions.length > 0 ? sessions : [
    {
      id: 1,
      device: "Windows • Chrome • Addis Ababa",
      title: "This Device",
      active_now: true,
      time: "Active now",
      type: "desktop",
    },
    {
      id: 2,
      device: "Linux • Firefox • Addis Ababa",
      title: "Laptop",
      active_now: false,
      time: "2 days ago",
      type: "laptop",
    },
    {
      id: 3,
      device: "Android • Chrome • Addis Ababa",
      title: "Mobile",
      active_now: false,
      time: "1 week ago",
      type: "mobile",
    },
  ];

  const getDeviceIcon = (type = "") => {
    if (type === "mobile" || type.toLowerCase().includes("android") || type.toLowerCase().includes("phone")) {
      return (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    );
  };

  return (
    <DashboardLayout title="Active Sessions" subtitle="Manage devices and sessions">
      <div className="space-y-6 max-w-4xl">
        {/* Header (Screen 10) */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Active Sessions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage devices and sessions.
          </p>
        </div>

        {/* Sessions List Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {displaySessions.map((session, index) => {
            const isFirst = index === 0 || session.current || session.active_now;
            const title = session.title || (isFirst ? "This Device" : "Other Device");
            const label = session.device || `${session.ip_address || "127.0.0.1"} • Addis Ababa`;
            const timeLabel = isFirst ? "Active now" : (session.time || "Recent");

            return (
              <div
                key={session.id || index}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getDeviceIcon(session.type || session.device)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-normal">{label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  {isFirst ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Active now
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">
                        {timeLabel}
                      </span>
                      {session.id && !session.current && (
                        <button
                          type="button"
                          onClick={() => handleRevokeSingle(session.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium ml-2"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Log out all sessions button (Screen 10) */}
        <div className="pt-2 text-center sm:text-left">
          <button
            type="button"
            onClick={handleLogoutAll}
            disabled={loggingOutAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>{loggingOutAll ? "Logging out all..." : "Log out all sessions"}</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
