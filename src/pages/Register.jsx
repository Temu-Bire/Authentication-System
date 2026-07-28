import React, { useState } from 'react';

export default function Register({ setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    // Simple strength evaluator mock
    if (val.length < 6) setStrength('Weak');
    else if (val.length < 10) setStrength('Medium');
    else setStrength('Strong');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: Connect to backend POST /api/register
    setCurrentView('dashboard');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" value={password} onChange={handlePasswordChange} required className="w-full mt-1 p-2 border rounded" />
          {password && <p className="text-xs mt-1 text-gray-500">Strength: <span className="font-bold">{strength}</span></p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <button onClick={() => setCurrentView('login')} className="text-blue-600 underline">Sign In</button>
      </p>
    </div>
  );
}