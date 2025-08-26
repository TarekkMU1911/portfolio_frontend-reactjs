import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const register = async ({ username, password }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/register",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      return res.data;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const login = async ({ username, password }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
