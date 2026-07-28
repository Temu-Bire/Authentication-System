import React from 'react';

export default function Dashboard({ setCurrentView }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <h2 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h2>
      <p className="text-gray-600 mb-6">You are successfully authenticated and viewing a protected resource.</p>
      
      <div className="flex justify-center gap-4">
        <button onClick={() => setCurrentView('sessions')} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
          Manage Active Sessions
        </button>
      </div>
    </div>
  );
}