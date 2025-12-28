import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PersonnelAuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export function PersonnelAuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const storedToken = localStorage.getItem('personnelToken');
      const isDoctorDisplay = localStorage.getItem('doctorDisplaySession');

      if (storedToken && !isDoctorDisplay) {
        sessionStorage.setItem('personnelSessionActive', 'true');
      }

      if (isDoctorDisplay) {
        sessionStorage.setItem('personnelSessionActive', 'true');
        localStorage.removeItem('doctorDisplaySession');
      }

      if (!storedToken) {
        localStorage.removeItem('personnelUser');
        return null;
      }

      const storedUser = localStorage.getItem('personnelUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });

  const [token, setToken] = useState(() => {
    try {
      const storedToken = localStorage.getItem('personnelToken');
      const isDoctorDisplay = localStorage.getItem('doctorDisplaySession');

      if (storedToken) {
        sessionStorage.setItem('personnelSessionActive', 'true');
      }

      return storedToken || null;
    } catch (error) { return null; }
  });

  const loginPersonnel = async (tokenOrObj, userObj) => {

    if (typeof tokenOrObj === "string" && userObj && typeof userObj === "object") {
      localStorage.setItem('personnelToken', tokenOrObj);
      localStorage.setItem('personnelUser', JSON.stringify(userObj));
      sessionStorage.setItem('personnelSessionActive', 'true');
      setToken(tokenOrObj);
      setUser(userObj);
      return;
    }

    let tokenString = null, userToStore = null;
    if (typeof tokenOrObj === "string") {
      tokenString = tokenOrObj;
    } else if (typeof tokenOrObj === "object" && tokenOrObj !== null) {
      tokenString = tokenOrObj.token || localStorage.getItem('personnelToken');
      userToStore = tokenOrObj.user || tokenOrObj;
    }

    if (tokenString) localStorage.setItem('personnelToken', tokenString);

    if (userToStore && typeof userToStore === "object" && !Array.isArray(userToStore)) {
      localStorage.setItem('personnelUser', JSON.stringify(userToStore));
      sessionStorage.setItem('personnelSessionActive', 'true');
      setUser(userToStore);
      setToken(tokenString);
    } else if (tokenString) {

      try {
        const meUrl = `${BaseURL}/auth/me`;
        const resp = await axios.get(meUrl, {
          headers: { Authorization: `Bearer ${tokenString}` },
        });
        const profile = resp.data?.data || resp.data;

        if (!profile.role || profile.role === "PATIENT") {
          throw new Error("Bu token bir personele ait değil.");
        }
        localStorage.setItem('personnelUser', JSON.stringify(profile));
        sessionStorage.setItem('personnelSessionActive', 'true');
        setUser(profile);
        setToken(tokenString);
      } catch (err) {
        logoutPersonnel();
        throw err;
      }
    }
  };

  const logoutPersonnel = () => {
    localStorage.removeItem('personnelUser');
    localStorage.removeItem('personnelToken');
    sessionStorage.removeItem('personnelSessionActive');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem('personnelToken');
    if (!currentToken) return;

    try {
      const resp = await axios.get(`${BaseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      const profile = resp.data?.data || resp.data;
      localStorage.setItem('personnelUser', JSON.stringify(profile));
      setUser(profile);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('personnelUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = { user, token, loginPersonnel, logoutPersonnel, refreshUser, updateUser };

  return (
    <PersonnelAuthContext.Provider value={value}>
      {children}
    </PersonnelAuthContext.Provider>
  );
}

export function usePersonnelAuth() {
  const context = useContext(PersonnelAuthContext);
  if (!context) throw new Error('usePersonnelAuth context hatası');
  return context;
}
