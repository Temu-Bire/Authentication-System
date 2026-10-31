import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function AccountSettings() {
  const { user, updateProfile, deleteAccount } = useAuth();

  // Edit Profile Modal
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "Temesgen Birhanu");

  // Update Email Modal
  const [updateEmailModal, setUpdateEmailModal] = useState(false);
  const [email, setEmail] = useState(user?.email || "temesgen@example.com");

  // Delete Account Modal
  const [deleteModal, setDeleteModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ full_name: fullName });
      setEditProfileModal(false);
      showToast("Profile details updated successfully.");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ email });
      setUpdateEmailModal(false);
      showToast("Email address updated successfully.");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update email.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      window.location.href = "/register";
    } catch (err) {
      alert("Failed to delete account.");
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Account Settings" subtitle="Manage your account preferences">
      <div className="space-y-6 max-w-4xl">
        {/* Header (Screen 12) */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your account preferences.
          </p>
        </div>

        {toastMessage && (
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
            {toastMessage}
          </div>
        )}

        {/* Account Settings Card (Screen 12) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* Row 1: Profile Information */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Profile Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your personal details.
              </p>
              <div className="mt-2 text-xs font-medium text-slate-700">
                Current Name: <span className="font-semibold">{user?.full_name || "Temesgen Birhanu"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFullName(user?.full_name || "Temesgen Birhanu");
                setEditProfileModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-center"
            >
              Edit
            </button>
          </div>

          {/* Row 2: Email Address */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Email Address</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your email address.
              </p>
              <div className="mt-2 text-xs font-medium text-slate-700">
                Current Email: <span className="font-semibold">{user?.email || "temesgen@example.com"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail(user?.email || "temesgen@example.com");
                setUpdateEmailModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-center"
            >
              Update
            </button>
          </div>

          {/* Row 3: Delete Account */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-rose-600 text-sm">Delete Account</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently remove your account and all associated sessions.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-xs font-semibold text-rose-600 transition-colors cursor-pointer self-start sm:self-center"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Edit Profile Information</h3>
            <p className="text-xs text-slate-500 mb-4">Update your display name.</p>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Email Modal */}
      {updateEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Update Email Address</h3>
            <p className="text-xs text-slate-500 mb-4">Enter a new email address for login and alerts.</p>
            <form onSubmit={handleSaveEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateEmailModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Update Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Delete Account?</h3>
            <p className="text-xs text-slate-500 mb-6">
              This action is permanent and cannot be reversed. All your authentication records, active sessions, and logs will be permanently wiped.
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors"
              >
                {loading ? "Deleting..." : "Yes, permanently delete my account"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
