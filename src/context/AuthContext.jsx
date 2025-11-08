import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // 🔥🔥 DAHA AKILLI LOGIN FONKSİYONU 🔥🔥
  const login = async (loginDataOrToken) => {
    // If a token string is passed, store it and fetch profile from /auth/me
    let token = null;

    if (typeof loginDataOrToken === 'string') {
      token = loginDataOrToken;
      localStorage.setItem('token', token);

      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
        const API_PREFIX = '/api/v1';
        const meUrl = `${API_BASE}${API_PREFIX}/auth/me`;
        const resp = await axios.get(meUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profile = resp.data?.data || resp.data;
        localStorage.setItem('user', JSON.stringify(profile));
        setUser(profile);
      } catch (err) {
        console.error('Profil alınamadı:', err);
        // token invalid -> remove
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        throw err;
      }
      return;
    }

    // Otherwise accept object form (backwards compat). Could be { token, user } or user object
    const userToStore = loginDataOrToken?.user ? loginDataOrToken.user : loginDataOrToken;
    token = loginDataOrToken?.token || localStorage.getItem('token');

    if (token) localStorage.setItem('token', token);
    if (userToStore && typeof userToStore === 'object') {
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
    } else {
      console.error('Login fonksiyonuna geçersiz kullanıcı verisi geldi:', loginDataOrToken);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
  }
  return context;
}