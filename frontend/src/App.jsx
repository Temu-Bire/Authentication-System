import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Sessions from "./pages/Sessions";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/sessions"
                element={
                  <ProtectedRoute>
                    <Sessions />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-900/80 py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>© 2026 NexusAuth Security Suite. Zero-knowledge end-to-end protection.</p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>AES-256</span>
                <span>•</span>
                <span>JWT Refresh Rotation</span>
                <span>•</span>
                <span>Multi-Session Shield</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
