import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GuestNavbar from "../components/GuestNavbar";
import { TwoFactorShieldArtwork } from "../components/AuthProIcons";
import api from "../api/axios";

export default function TwoFactorVerify() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // 45-second countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Handle digit inputs and auto-advance
  const handleDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    // Handle single character
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    // Auto-focus next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const splitDigits = pasteData.split("");
      setDigits(splitDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/2fa/verify", { code });
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Invalid 2FA code. Please check your authenticator and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(45);
    setError("");
    alert("A new one-time verification code has been dispatched to your backup channel.");
  };

  const formattedTimer = `00:${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <GuestNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Screen 4 Card */}
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-slate-200/40 p-8 sm:p-10 text-center">
          {/* Shield Artwork */}
          <div className="flex justify-center mb-6">
            <TwoFactorShieldArtwork />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed max-w-xs mx-auto">
            Enter the 6-digit code from your authenticator app (Google Authenticator, Authy, etc.).
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-slate-200/90 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs transition-all"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Resend Link with Timer */}
          <div className="mt-6 text-xs text-slate-500">
            Didn't get the code?{" "}
            {secondsLeft > 0 ? (
              <span className="text-indigo-600 font-medium">Resend ({formattedTimer})</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Resend Code
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
