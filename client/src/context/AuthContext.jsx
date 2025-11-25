import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5000';

  // Helper function to decode JWT token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      axios.defaults.headers.common['auth-token'] = token;
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token } = response.data;
      
      if (!token) {
        return {
          success: false,
          message: 'Login failed. No token received.'
        };
      }

      // Decode token to get user ID
      const decoded = decodeToken(token);
      
      // Create simple user object
      const userData = {
        _id: decoded._id,
        email: email
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['auth-token'] = token;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      let message = 'Login failed. Please try again.';
      
      if (error.response?.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || message;
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { token } = response.data;
      
      if (!token) {
        return {
          success: false,
          message: 'Registration failed. No token received.'
        };
      }

      // Decode token to get user ID
      const decoded = decodeToken(token);
      
      // Create simple user object
      const userData = {
        _id: decoded._id,
        name: name,
        email: email
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['auth-token'] = token;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      
      if (error.response?.data) {
        message = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || message;
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Please ensure the backend is running.';
      }
      
      return { 
        success: false, 
        message 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['auth-token'];
    setUser(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
