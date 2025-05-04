import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Check if token is expired
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          // Token expired, log out
          logout();
        } else {
          // Set auth token header
          setAuthToken(token);
          
          // Get user data
          loadUser();
        }
      } catch (err) {
        console.error('Token validation error:', err);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Set axios auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user data
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/users/profile');
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Load user error:', err.response?.data?.message || err.message);
      logout();
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      const res = await axios.post('/api/users/register', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set auth token header
      setAuthToken(res.data.token);
      
      // Set user
      setUser(res.data);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const res = await axios.post('/api/users/login', { email, password });
      
      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      
      // Set auth token header
      setAuthToken(res.data.token);
      
      // Set user
      setUser(res.data);
      setLoading(false);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove auth header
    setAuthToken(null);
    
    // Clear user
    setUser(null);
    setLoading(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const res = await axios.put('/api/users/profile', userData);
      
      // Update user state
      setUser(res.data);
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      return { success: false, error: err.response?.data?.message || 'Profile update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
