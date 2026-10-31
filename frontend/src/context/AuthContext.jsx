import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    await fetchUserProfile();
    return res.data;
  };

  const register = async (email, password, fullName) => {
    const payload = {
      email,
      password,
      full_name: fullName || "Temesgen Birhanu",
    };
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("access_token", res.data.access_token);
    localStorage.setItem("refresh_token", res.data.refresh_token);
    await fetchUserProfile();
    return res.data;
  };

  const googleLogin = async (googleCredential) => {
    const res = await api.post("/auth/google-login", { token: googleCredential });
    localStorage.setItem("access_token", res.data.access_token);
    if (res.data.refresh_token) {
      localStorage.setItem("refresh_token", res.data.refresh_token);
    }
    await fetchUserProfile();
    return res.data;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch (err) {
      console.error("Server logout error", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.patch("/users/me/profile", profileData);
    setUser(res.data);
    return res.data;
  };

  const updatePrivacy = async (privacyData) => {
    const res = await api.patch("/users/me/privacy", privacyData);
    setUser(res.data);
    return res.data;
  };

  const updateSecurity = async (securityData) => {
    const res = await api.patch("/users/me/security", securityData);
    setUser(res.data);
    return res.data;
  };

  const logoutAllSessions = async () => {
    try {
      await api.post("/sessions/logout-all");
    } catch (err) {
      console.error("Logout all sessions error", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    }
  };

  const deleteAccount = async () => {
    await api.delete("/users/me");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user || !!localStorage.getItem("access_token"),
    login,
    register,
    googleLogin,
    logout,
    refreshUser: fetchUserProfile,
    updateProfile,
    updatePrivacy,
    updateSecurity,
    logoutAllSessions,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
