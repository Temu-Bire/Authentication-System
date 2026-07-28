import React, { useState } from 'react';

export default function Sessions() {
  // Mock session data
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', ip: '192.168.1.10', current: true },
    { id: 2, device: 'Safari on iPhone', ip: '172.16.0.4', current: false }
  ]);

  const revokeSession = (id) => {
    // TODO: Connect to backend DELETE /api/sessions/:id
    setSessions(sessions.filter(s => s.id !== id));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Active Sessions</h2>
      <p className="text-gray-600 text-sm mb-6">Manage and log out of your active sessions running on other browsers or devices.</p>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">
                {session.device} {session.current && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded ml-2">Current</span>}
              </p>
              <p className="text-xs text-gray-500">IP Address: {session.ip}</p>
            </div>
            {!session.current && (
              <button onClick={() => revokeSession(session.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}