import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';

export default function App() {
  // Simple view switcher state ('login', 'register', 'dashboard', 'sessions')
  const [currentView, setCurrentView] = useState('login');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="max-w-4xl mx-auto p-4 mt-6">
        {currentView === 'login' && <Login setCurrentView={setCurrentView} />}
        {currentView === 'register' && <Register setCurrentView={setCurrentView} />}
        {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} />}
        {currentView === 'sessions' && <Sessions setCurrentView={setCurrentView} />}
      </main>
    </div>
  );
}