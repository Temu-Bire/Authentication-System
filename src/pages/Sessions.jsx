import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sessions() {

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadSessions();

  }, []);

  const loadSessions = async () => {

    try {

      const response = await api.get("/sessions");

      setSessions(response.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const revokeSession = async (id) => {

    try {

      await api.delete(`/sessions/${id}`);

      setSessions((prev) =>
        prev.filter((session) => session.id !== id)
      );

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {
    return (
      <p className="text-center">
        Loading sessions...
      </p>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow">

      <h2 className="text-2xl font-bold mb-4">
        Active Sessions
      </h2>

      <div className="space-y-4">

        {sessions.length === 0 ? (

          <p>No active sessions.</p>

        ) : (

          sessions.map((session) => (

            <div
              key={session.id}
              className="border rounded p-4 flex justify-between items-center"
            >

              <div>

                <h3 className="font-semibold">
                  {session.device}
                </h3>

                <p className="text-sm text-gray-500">
                  {session.ip}
                </p>

                {session.current && (
                  <span className="text-green-600 text-sm">
                    Current Session
                  </span>
                )}

              </div>

              {!session.current && (

                <button
                  onClick={() => revokeSession(session.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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