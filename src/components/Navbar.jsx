import React from 'react';

export default function Navbar({ currentView, setCurrentView }) {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="font-bold text-xl text-blue-600 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
        SecureAuth App
      </h1>
      <div className="space-x-4">
        {currentView === 'login' || currentView === 'register' ? (
          <>
            <button onClick={() => setCurrentView('login')} className="text-gray-600 hover:text-blue-600">Login</button>
            <button onClick={() => setCurrentView('register')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</button>
          </>
        ) : (
          <>
            <button onClick={() => setCurrentView('dashboard')} className="text-gray-600 hover:text-blue-600">Dashboard</button>
            <button onClick={() => setCurrentView('sessions')} className="text-gray-600 hover:text-blue-600">Active Sessions</button>
            <button onClick={() => setCurrentView('login')} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}