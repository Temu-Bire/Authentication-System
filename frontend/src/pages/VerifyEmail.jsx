import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import GuestNavbar, { TopBadgesBar } from "../components/GuestNavbar";
import { EmailVerificationArtwork } from "../components/AuthProIcons";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const location = useLocation();
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [resendStatus, setResendStatus] = useState("");

  const targetEmail = location.state?.email || user?.email || "temesgen@example.com";

  // 45-second countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(45);
    setResendStatus("A fresh verification email has been sent!");
    setTimeout(() => setResendStatus(""), 4000);
  };

  const formattedTimer = `00:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <TopBadgesBar />
      <GuestNavbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Screen 7: Verify Email Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/40 p-8 sm:p-10 text-center">
          {/* Email Envelope with Green Check Badge */}
          <div className="flex justify-center mb-6">
            <EmailVerificationArtwork />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Verify Your Email
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-xs mx-auto">
            We've sent a verification link to <br />
            <strong className="text-slate-800 font-semibold">{targetEmail}</strong>
          </p>

          {resendStatus && (
            <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
              {resendStatus}
            </div>
          )}

          {/* Primary Action Button: Open Email App */}
          <div className="space-y-3">
            <a
              href="mailto:"
              className="w-full py-2.5 px-4 rounded-xl bg-white border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-600 font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span>Open Email App</span>
            </a>

            <Link
              to="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Continue to Dashboard
            </Link>
          </div>

          {/* Resend Email with Timer */}
          <div className="mt-6 text-xs text-slate-500">
            {secondsLeft > 0 ? (
              <span className="text-indigo-600 font-medium">Resend Email ({formattedTimer})</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Resend Email
              </button>
            )}
          </div>

          {/* Back to Login */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
