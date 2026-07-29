import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
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
    try {
      await api.delete(`/sessions/${id}`);
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err) {
      console.error("Failed to revoke session", err);
    }
  };

  const revokeAllOtherSessions = async () => {
    try {
      await api.delete("/sessions");
      loadSessions();
    } catch (err) {
      console.error("Failed to revoke other sessions", err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Loading active sessions...</p>;
  }

  const otherSessionsExist = sessions.some((s) => !s.current);

  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold">Active Sessions</h2>
          <p className="text-sm text-gray-500">Manage device sessions linked to your account.</p>
        </div>

        {otherSessionsExist && (
          <button
            onClick={revokeAllOtherSessions}
            className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Revoke All Other Sessions
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No active sessions found.</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`border rounded-lg p-4 flex justify-between items-center transition-colors ${
                session.is_suspicious ? "bg-amber-50 border-amber-300" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800 text-sm">{session.device || "Unknown Device"}</h3>

                  {session.current && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      Current Session
                    </span>
                  )}

                  {session.is_suspicious && (
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
                      ⚠️ Suspicious Login
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-500 font-mono">IP Address: {session.ip_address || "127.0.0.1"}</p>
                <p className="text-xs text-gray-400">
                  Last active: {new Date(session.last_used_at).toLocaleString()}
                </p>
              </div>

              {!session.current && (
                <button
                  onClick={() => revokeSession(session.id)}
                  className="bg-red-500 text-white text-xs px-3 py-1.5 rounded font-medium hover:bg-red-600 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}