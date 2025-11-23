import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const StaffAuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

/**
 * StaffAuthProvider Context: Personel oturum yönetimi (token & kullanıcı ile)
 * - İster token ve user birlikte ister tek token ile çalışır.
 * - token ile giriş yapılınca /auth/me'den profili çeker.
 * - loginStaff(token, user) veya loginStaff(token) olarak iki kullanım destekler.
 */
export function StaffAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('staffUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('staffToken') || null;
    } catch (error) { return null; }
  });

  /**
   * Gelişmiş loginStaff fonksiyonu: ister loginStaff(token, user) çağır,
   * ister loginStaff(token) tek parametreyle çağır.
   */
  const loginStaff = async (tokenOrObj, userObj) => {
    // loginStaff(token, user): doğrudan kullanıcının oturumunu aç
    if (typeof tokenOrObj === "string" && userObj && typeof userObj === "object") {
      localStorage.setItem('staffToken', tokenOrObj);
      localStorage.setItem('staffUser', JSON.stringify(userObj));
      setToken(tokenOrObj);
      setUser(userObj);
      return;
    }
    // loginStaff(token): sadece token ile çağrılırsa
    let tokenString = null, userToStore = null;
    if (typeof tokenOrObj === "string") {
      tokenString = tokenOrObj;
    } else if (typeof tokenOrObj === "object" && tokenOrObj !== null) {
      tokenString = tokenOrObj.token || localStorage.getItem('staffToken');
      userToStore = tokenOrObj.user || tokenOrObj;
    }

    if (tokenString) localStorage.setItem('staffToken', tokenString);

    if (userToStore && typeof userToStore === "object" && !Array.isArray(userToStore)) {
      localStorage.setItem('staffUser', JSON.stringify(userToStore));
      setUser(userToStore);
      setToken(tokenString);
    } else if (tokenString) {
      // SADECE TOKEN VARSA: Profili çek
      try {
        const meUrl = `${BaseURL}/auth/me`;
        const resp = await axios.get(meUrl, {
          headers: { Authorization: `Bearer ${tokenString}` },
        });
        const profile = resp.data?.data || resp.data;
        // Güvenlik: Personel mi kontrolü (dilersen rol kontrolünü artırabilirsin)
        if (!profile.role || profile.role === "PATIENT") {
          throw new Error("Bu token bir personele ait değil.");
        }
        localStorage.setItem('staffUser', JSON.stringify(profile));
        setUser(profile);
        setToken(tokenString);
      } catch (err) {
        logoutStaff();
        throw err;
      }
    }
  };

  const logoutStaff = () => {
    localStorage.removeItem('staffUser');
    localStorage.removeItem('staffToken');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loginStaff, logoutStaff };

  return (
    <StaffAuthContext.Provider value={value}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const context = useContext(StaffAuthContext);
  if (!context) throw new Error('useStaffAuth context hatası');
  return context;
}