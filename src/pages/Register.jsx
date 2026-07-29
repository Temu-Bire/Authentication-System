import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live password validation checks
  const passChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const isPasswordStrong = Object.values(passChecks).every(Boolean);

  // Normal register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordStrong) {
      setError("Password does not meet security requirements.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);

      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.join(", "));
      } else {
        setError(detail || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Register
  const handleGoogleRegister = async (response) => {
    try {
      const googleToken = response.credential;
      const result = await api.post("/auth/google-login", {
        token: googleToken,
      });

      localStorage.setItem("access_token", result.data.access_token);
      if (result.data.refresh_token) {
        localStorage.setItem("refresh_token", result.data.refresh_token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError("Google registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      {error && (
        <p className="mb-4 text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Dynamic Password Strength Indicators */}
        <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
          <p className="font-semibold text-gray-700 mb-1">Password Requirements:</p>
          <div className="grid grid-cols-2 gap-1">
            <span className={passChecks.length ? "text-green-600 font-medium" : "text-gray-400"}>
              {passChecks.length ? "✓" : "○"} At least 8 characters
            </span>
            <span className={passChecks.upper ? "text-green-600 font-medium" : "text-gray-400"}>
              {passChecks.upper ? "✓" : "○"} Uppercase letter (A-Z)
            </span>
            <span className={passChecks.lower ? "text-green-600 font-medium" : "text-gray-400"}>
              {passChecks.lower ? "✓" : "○"} Lowercase letter (a-z)
            </span>
            <span className={passChecks.number ? "text-green-600 font-medium" : "text-gray-400"}>
              {passChecks.number ? "✓" : "○"} At least one number
            </span>
            <span className={passChecks.special ? "text-green-600 font-medium" : "text-gray-400"}>
              {passChecks.special ? "✓" : "○"} Special (@$!%*?&)
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <div className="my-5 text-center text-gray-500 text-sm">OR</div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleRegister}
          onError={() => setError("Google registration failed")}
        />
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}