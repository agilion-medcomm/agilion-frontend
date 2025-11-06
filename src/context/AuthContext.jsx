import React, { createContext, useState, useContext } from 'react';

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
  const login = (loginData) => {
    // 1. Gelen verinin içinde bir "user" anahtarı var mı diye kontrol et.
    //    (Örnek: { user: { firstName: ... }, token: ... })
    //    Eğer varsa, asıl kullanıcı bilgisi odur.
    const userToStore = loginData.user ? loginData.user : loginData;
    const tokenToStore = loginData.token ? loginData.token : localStorage.getItem('token'); // Token yoksa eskisini koru

    // 2. Gereksiz veya hatalı bir veri gelmediğinden emin ol.
    if (userToStore && typeof userToStore === 'object' && Object.keys(userToStore).length > 0) {
      
      // 3. Hafızaya ve state'e doğru veriyi kaydet.
      localStorage.setItem('user', JSON.stringify(userToStore));
      if (tokenToStore) {
        localStorage.setItem('token', tokenToStore);
      }
      
      setUser(userToStore); // State'i güncelle
    } else {
      console.error("Login fonksiyonuna geçersiz kullanıcı verisi geldi:", loginData);
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