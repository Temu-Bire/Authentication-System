import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { ToggleSwitch, TwoFactorShieldArtwork } from "../components/AuthProIcons";
import api from "../api/axios";

export default function SecuritySettings() {
  const { user, updateSecurity } = useAuth();

  // State
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is_2fa_enabled ?? true);
  const [loginAlerts, setLoginAlerts] = useState(user?.login_alerts ?? true);
  const [manage2FAModal, setManage2FAModal] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const handleToggleLoginAlerts = async (val) => {
    setLoginAlerts(val);
    try {
      await updateSecurity({ login_alerts: val });
    } catch (err) {
      console.error("Failed to update login alerts", err);
    }
  };

  const handleToggle2FA = async (val) => {
    setIs2FAEnabled(val);
    try {
      await updateSecurity({ is_2fa_enabled: val });
    } catch (err) {
      console.error("Failed to update 2FA", err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    setPasswordLoading(true);

    try {
      await api.put("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSuccess("Password successfully changed!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setChangePasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout title="Security Settings" subtitle="Strengthen your account security">
      <div className="space-y-6 max-w-4xl">
        {/* Header (Screen 9) */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Security Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Strengthen your account security.
          </p>
        </div>

        {/* Security Options Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* Row 1: Two-Factor Authentication */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Two-Factor Authentication</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add an extra layer of security to your account.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:self-center">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  is2FAEnabled
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {is2FAEnabled ? "Enabled" : "Disabled"}
              </span>
              <button
                type="button"
                onClick={() => setManage2FAModal(true)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Row 2: Login Alerts */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Login Alerts</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get notified about new logins and suspicious activity.
                </p>
              </div>
            </div>

            <div className="flex items-center sm:self-center">
              <ToggleSwitch checked={loginAlerts} onChange={handleToggleLoginAlerts} />
            </div>
          </div>

          {/* Row 3: Password */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Password</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your password regularly.
                </p>
              </div>
            </div>

            <div className="flex items-center sm:self-center">
              <button
                type="button"
                onClick={() => setChangePasswordModal(true)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Decorative 3D Shield Banner (Screen 9 Artwork) */}
        <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/50 to-purple-50/60 rounded-3xl p-6 sm:p-8 border border-slate-200/70 flex items-center justify-between">
          <div className="max-w-md">
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Maximum Account Protection Active
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your cryptographic credentials and active sessions are monitored in real time with automated token revocation.
            </p>
          </div>
          <div className="hidden sm:block">
            <TwoFactorShieldArtwork className="w-16 h-16" />
          </div>
        </div>
      </div>

      {/* Manage 2FA Modal */}
      {manage2FAModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Two-Factor Authentication</h3>
            <p className="text-xs text-slate-500 mb-6">
              {is2FAEnabled
                ? "Two-Factor Authentication is currently active for your account."
                : "Enable 2FA to require a one-time verification code on sign-in."}
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  handleToggle2FA(!is2FAEnabled);
                  setManage2FAModal(false);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold ${
                  is2FAEnabled
                    ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {is2FAEnabled ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}
              </button>
              <button
                type="button"
                onClick={() => setManage2FAModal(false)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Change Password</h3>
              <button
                onClick={() => setChangePasswordModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-600">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {passwordLoading ? "Saving..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
