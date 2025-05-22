import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in Axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Load user from token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          logout();
        } else {
          setAuthToken(token);
          setUser(decoded);
        }
      } catch (err) {
        console.error("Token decode error:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`http://localhost:3001/api/auth/register`, userData);
      const { token } = response.data;

      localStorage.setItem("token", token);
      setAuthToken(token);

      const decoded = jwt_decode(token);
      setUser(decoded);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`http://localhost:3001/api/auth/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      setAuthToken(token);

      const decoded = jwt_decode(token);
      setUser(decoded);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    setLoading(false);
  };

  // Update profile (optional)
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const response = await axios.put(`http://localhost:3001/api/users/profile`, userData);
      setUser(response.data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Profile update failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Correct default export
export default AuthProvider;
