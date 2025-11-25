import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import { AuthContext } from './AuthContext.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    const urlParams = new URLSearchParams(globalThis.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      globalThis.history.replaceState({}, document.title, globalThis.location.pathname);
      return urlToken;
    }
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('guestMode') === 'true') {
        const guestUser = {
          id: 'guest',
          email: 'guest@example.com',
          name: 'Guest',
          isGuest: true
        };
        setUser(guestUser);
        setToken('guest');
        setLoading(false);
        return;
      }

      if (token && token !== 'guest') {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Login failed. Please try again.'
      };
    }
  }, []);

  const signup = useCallback(async (email, password, name) => {
    try {
      const response = await api.post('/auth/signup', { email, password, name });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.userMessage || 'Signup failed. Please try again.'
      };
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser = {
      id: 'guest',
      email: 'guest@example.com',
      name: 'Guest',
      isGuest: true
    };
    setUser(guestUser);
    setToken('guest');
    localStorage.setItem('guestMode', 'true');
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user?.isGuest) {
        localStorage.removeItem('guestTransactions');
        localStorage.removeItem('guestMode');
      } else {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestTransactions');
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    signup,
    loginAsGuest,
    logout,
    isAuthenticated: !!user
  }), [user, loading, login, signup, loginAsGuest, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
