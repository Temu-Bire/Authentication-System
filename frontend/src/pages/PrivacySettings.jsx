import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { ToggleSwitch } from "../components/AuthProIcons";

export default function PrivacySettings() {
  const { user, updatePrivacy } = useAuth();

  const [profileVisibility, setProfileVisibility] = useState(user?.profile_visibility ?? true);
  const [dataSharing, setDataSharing] = useState(user?.data_sharing ?? false);
  const [marketingEmails, setMarketingEmails] = useState(user?.marketing_emails ?? false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleToggleVisibility = async (val) => {
    setProfileVisibility(val);
    try {
      await updatePrivacy({ profile_visibility: val });
      showToast("Profile visibility updated.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDataSharing = async (val) => {
    setDataSharing(val);
    try {
      await updatePrivacy({ data_sharing: val });
      showToast("Data telemetry preference saved.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMarketing = async (val) => {
    setMarketingEmails(val);
    try {
      await updatePrivacy({ marketing_emails: val });
      showToast("Marketing communication settings saved.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout title="Privacy Settings" subtitle="Control your data and privacy">
      <div className="space-y-6 max-w-4xl">
        {/* Header (Screen 11) */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Privacy Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Control your data and privacy.
          </p>
        </div>

        {toastMessage && (
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-medium">
            {toastMessage}
          </div>
        )}

        {/* Settings Card (Screen 11) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {/* Row 1: Profile Visibility */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Profile Visibility</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Allow others to find and view your profile.
              </p>
            </div>
            <ToggleSwitch
              checked={profileVisibility}
              onChange={handleToggleVisibility}
            />
          </div>

          {/* Row 2: Data Sharing */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Data Sharing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Help improve our services.
              </p>
            </div>
            <ToggleSwitch
              checked={dataSharing}
              onChange={handleToggleDataSharing}
            />
          </div>

          {/* Row 3: Marketing Emails */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Marketing Emails</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive product updates and offers.
              </p>
            </div>
            <ToggleSwitch
              checked={marketingEmails}
              onChange={handleToggleMarketing}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/60 text-slate-500 text-xs leading-relaxed">
          Your privacy preferences are synchronized in real-time across your account and all associated application sessions.
        </div>
      </div>
    </DashboardLayout>
  );
}
