import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {user?.has_suspicious_activity && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-amber-900 shadow-sm flex justify-between items-center">
          <div>
            <h4 className="font-bold">⚠️ Security Notice: Suspicious Login Detected</h4>
            <p className="text-sm">
              We detected a sign-in from a new IP address or device. Please review your active sessions.
            </p>
          </div>
          <button
            onClick={() => navigate("/sessions")}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
          >
            Review Sessions
          </button>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
        <p className="text-gray-600 mb-6">
          You are securely logged into your account.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading user profile...</p>
        ) : (
          user && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Account Email:</span>
                <span className="font-semibold text-gray-800">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sign-in Method:</span>
                <span className="font-semibold text-blue-600">
                  {user.google_id ? "Google OAuth 2.0" : "Email & Password"}
                </span>
              </div>
              {user.last_login_ip && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Login IP:</span>
                  <span className="font-mono text-gray-700">{user.last_login_ip}</span>
                </div>
              )}
            </div>
          )
        )}

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/sessions")}
            className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-900 font-medium transition-colors"
          >
            Manage Active Sessions
          </button>
        </div>
      </div>
    </div>
  );
}