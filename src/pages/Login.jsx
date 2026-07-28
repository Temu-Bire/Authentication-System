import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sign In
      </h2>

      {error && (
        <p className="mb-4 text-red-500 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleLogin} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            className="w-full mt-1 p-2 border rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            className="w-full mt-1 p-2 border rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

      </form>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}