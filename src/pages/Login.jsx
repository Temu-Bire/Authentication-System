import React, { useState } from 'react';

export default function Login({ setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Connect to backend POST /api/login
    if (email && password) {
      setCurrentView('dashboard');
    } else {
      setError('Please fill in all fields.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full mt-1 p-2 border rounded focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Sign In</button>
      </form>

      <div className="mt-6">
        <button className="w-full border border-gray-300 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50">
          <span className="font-medium text-sm text-gray-700">Sign in with Google</span>
        </button>
      </div>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <button onClick={() => setCurrentView('register')} className="text-blue-600 underline">Register</button>
      </p>
    </div>
  );
}