import React, { createContext, useState, useContext } from 'react';
// Kullanıcı (hasta) oturumu için context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return null;
      const userData = JSON.parse(storedUser);
      // Ensure 'id' field exists (appointments fetch için zorunlu)
      if (!userData.id && userData.userId) {
        userData.id = userData.userId;
      }
      return userData;
    } catch (error) { return null; }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null;
    } catch (error) { return null; }
  });

  // Hasta login fonksiyonu (token ve user ile)
  const login = async (tokenOrObj, userObj) => {
    let tokenString = null;
    let userToStore = null;

    // Case 1: login(token, userObj) - token string + user object
    if (typeof tokenOrObj === "string" && userObj && typeof userObj === "object") {
      tokenString = tokenOrObj;
      userToStore = userObj;
    }
    // Case 2: login(obj) - object with token and user
    else if (typeof tokenOrObj === "object" && tokenOrObj !== null) {
      tokenString = tokenOrObj.token;
      userToStore = tokenOrObj.user;
    }

    // Ensure id field exists
    if (userToStore && !userToStore.id) {
      userToStore.id = userToStore.userId;
    }

    // Save to localStorage immediately
    if (tokenString) {
      localStorage.setItem('token', tokenString);
    }
    if (userToStore) {
      localStorage.setItem('user', JSON.stringify(userToStore));
      setUser(userToStore);
    }
    if (tokenString) {
      setToken(tokenString);
    }

    // Optional: Verify with /auth/me to get fresh profile data
    if (tokenString) {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
        const API_PREFIX = '/api/v1';
        const BaseURL = `${API_BASE}${API_PREFIX}`;
        const meResp = await fetch(`${BaseURL}/auth/me`, {
          headers: { Authorization: `Bearer ${tokenString}` }
        });
        if (meResp.ok) {
          const meData = await meResp.json();
          const userData = meData.data || meData;
          if (!userData.id && userData.userId) {
            userData.id = userData.userId;
          }
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (err) {
        // /auth/me başarısız olsa da, önceden kaydedilen user ile devam et
        console.warn('Profile refresh başarısız, önceki user ile devam ediliyor', err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const value = { user, token, login, logout, updateUser };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth context hatası');
  return context;
}

const PersonnelAuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

/**
 * PersonnelAuthProvider Context: Sadece gerekli personel bilgileriyle oturum yönetimi
 * phoneNumber ve tckn dışındaki gereksiz alanlar kaldırıldı.
 */
export function PersonnelAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('personnelUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) { return null; }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('personnelToken') || null;
    } catch (error) { return null; }
  });

  /**
   * loginPersonnel fonksiyonu: yalnızca personel için giriş işlemi yapar.
   * Hem token+user obje hem sadece token ile çalışır.
   * Gereksiz property kalmadı.
   */
  const loginPersonnel = async (tokenOrObj, userObj) => {
    if (typeof tokenOrObj === "string" && userObj && typeof userObj === "object") {
      // Yalnızca gerekli property'ler alınır
      const slimUser = {
        tckn: userObj.tckn,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        role: userObj.role,
        phoneNumber: userObj.phoneNumber
      };
      localStorage.setItem('personnelToken', tokenOrObj);
      localStorage.setItem('personnelUser', JSON.stringify(slimUser));
      setToken(tokenOrObj);
      setUser(slimUser);
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
      // Sadece gerekli alanlar alınıyor
      const slimUser = {
        tckn: userToStore.tckn,
        firstName: userToStore.firstName,
        lastName: userToStore.lastName,
        role: userToStore.role,
        phoneNumber: userToStore.phoneNumber
      };
      localStorage.setItem('personnelUser', JSON.stringify(slimUser));
      setUser(slimUser);
      setToken(tokenString);
    } else if (tokenString) {
      // SADECE TOKEN VARSA: Profili çek
      try {
        const meUrl = `${BaseURL}/auth/me`;
        const resp = await axios.get(meUrl, { headers: { Authorization: `Bearer ${tokenString}` } });
        const profile = resp.data?.data || resp.data;
        if (!profile.role || profile.role === "PATIENT") {
          throw new Error("Bu token bir personele ait değil.");
        }
        // Gereksiz alanlar filtrelendi
        const slimUser = {
          tckn: profile.tckn,
          firstName: profile.firstName,
          lastName: profile.lastName,
          role: profile.role,
          phoneNumber: profile.phoneNumber
        };
        localStorage.setItem('personnelUser', JSON.stringify(slimUser));
        setUser(slimUser);
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
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loginPersonnel, logoutPersonnel };

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