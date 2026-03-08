import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("dogvaathi_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      const userData = res.data;
      localStorage.setItem("dogvaathi_user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch {
      return null;
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("dogvaathi_token", res.data.token);
    localStorage.setItem("dogvaathi_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success("Logged in");
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("dogvaathi_token", res.data.token);
    localStorage.setItem("dogvaathi_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success("Account created");
  };

  const logout = () => {
    localStorage.removeItem("dogvaathi_token");
    localStorage.removeItem("dogvaathi_user");
    setUser(null);
    window.dispatchEvent(new Event("dogvaathi_logout"));
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

