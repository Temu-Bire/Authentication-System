import React from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "New Login Detected",
      description: "A successful login occurred on Windows • Chrome (Addis Ababa, 127.0.0.1).",
      time: "10 minutes ago",
      unread: true,
      type: "alert",
    },
    {
      id: 2,
      title: "Two-Factor Verification Enabled",
      description: "Two-factor authentication is protecting your account with TOTP codes.",
      time: "2 hours ago",
      unread: false,
      type: "success",
    },
    {
      id: 3,
      title: "Security Scan Clean",
      description: "Zero suspicious IP addresses or unauthorized session tokens detected.",
      time: "Yesterday",
      unread: false,
      type: "info",
    },
  ];

  return (
    <DashboardLayout title="Notifications" subtitle="Account alerts and security events">
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifications
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review security notices and activity alerts.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {notifications.map((n) => (
            <div key={n.id} className="p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    n.type === "alert"
                      ? "bg-amber-50 text-amber-600"
                      : n.type === "success"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">{n.time}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
