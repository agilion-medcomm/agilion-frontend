import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const PersonnelAuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

/**
 * PersonnelAuthProvider Context: Personel oturum yönetimi (token & kullanıcı ile)
 * - Sayfa kapandığında oturum otomatik sonlanır (sessionStorage ile kontrol)
 * - loginPersonnel(token, user) veya loginPersonnel(token) olarak iki kullanım destekler.
 */
export function PersonnelAuthProvider({ children }) {
  // Sayfa yeni açıldıysa (sessionStorage boşsa) oturumu temizle
  const [user, setUser] = useState(() => {
    try {
      // Session aktif mi kontrol et
      const sessionActive = sessionStorage.getItem('personnelSessionActive');
      if (!sessionActive) {
        // Sayfa yeni açıldı, eski oturumu temizle
        localStorage.removeItem('personnelUser');
        localStorage.removeItem('personnelToken');
        return null;
      }
      const storedUser = localStorage.getItem('personnelUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });

  const [token, setToken] = useState(() => {
    try {
      const sessionActive = sessionStorage.getItem('personnelSessionActive');
      if (!sessionActive) {
        return null;
      }
      return localStorage.getItem('personnelToken') || null;
    } catch (error) { return null; }
  });

  /**
   * Gelişmiş loginPersonnel fonksiyonu: ister loginPersonnel(token, user) çağır,
   * ister loginPersonnel(token) tek parametreyle çağır.
   */
  const loginPersonnel = async (tokenOrObj, userObj) => {
    // loginPersonnel(token, user): doğrudan kullanıcının oturumunu aç
    if (typeof tokenOrObj === "string" && userObj && typeof userObj === "object") {
      localStorage.setItem('personnelToken', tokenOrObj);
      localStorage.setItem('personnelUser', JSON.stringify(userObj));
      sessionStorage.setItem('personnelSessionActive', 'true'); // Session başlat
      setToken(tokenOrObj);
      setUser(userObj);
      return;
    }
    // loginPersonnel(token): sadece token ile çağrılırsa
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
      sessionStorage.setItem('personnelSessionActive', 'true'); // Session başlat
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
        localStorage.setItem('personnelUser', JSON.stringify(profile));
        sessionStorage.setItem('personnelSessionActive', 'true'); // Session başlat
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
    sessionStorage.removeItem('personnelSessionActive'); // Session sonlandır
    setToken(null);
    setUser(null);
  };

  // Refresh user data from server (e.g., after photo upload)
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

  // Update user locally (without server call)
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