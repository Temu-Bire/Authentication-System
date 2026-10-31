import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Guest Screens 1-7
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TwoFactorVerify from "./pages/TwoFactorVerify";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

// Authenticated App Screens 8-12
import Dashboard from "./pages/Dashboard";
import SecuritySettings from "./pages/SecuritySettings";
import Sessions from "./pages/Sessions";
import PrivacySettings from "./pages/PrivacySettings";
import AccountSettings from "./pages/AccountSettings";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
          <Routes>
            {/* Screen 1: Landing Page (Guest) */}
            <Route path="/" element={<Landing />} />

            {/* Screen 2: Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Screen 3: Sign Up Page */}
            <Route path="/register" element={<Register />} />

            {/* Screen 4: 2FA Verification */}
            <Route path="/2fa" element={<TwoFactorVerify />} />

            {/* Screen 5: Forgot Password */}
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Screen 6: Reset Password */}
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Screen 7: Verify Email */}
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Screen 8: Dashboard (After Login) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Screen 9: Security Settings */}
            <Route
              path="/security"
              element={
                <ProtectedRoute>
                  <SecuritySettings />
                </ProtectedRoute>
              }
            />

            {/* Screen 10: Session Management */}
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              }
            />

            {/* Screen 11: Privacy Settings */}
            <Route
              path="/privacy"
              element={
                <ProtectedRoute>
                  <PrivacySettings />
                </ProtectedRoute>
              }
            />

            {/* Screen 12: Account Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />

            {/* Additional App View: Notifications */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
