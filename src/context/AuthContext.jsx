// src/context/AuthContext.jsx (YENİ DOSYA)

import React, { createContext, useState, useContext } from 'react';

// 1. Kasanın (Context) kendisini oluştur
const AuthContext = createContext(null);

// 2. Kasanın "sağlayıcısını" (Provider) oluştur.
// Bu, tüm uygulamayı saracak olan component'tir.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Başlangıçta kullanıcı yok (null)

  // Giriş yapma fonksiyonu
  const login = (userData) => {
    setUser(userData);
    // (İleride tarayıcı hafızasına da (localStorage) buradan kaydedebiliriz)
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    setUser(null);
    // (İleride localStorage'dan da silmemiz gerekecek)
  };

  // Kasaya konulacak değerler
  const value = {
    user,    // Mevcut kullanıcı bilgisi (ya null ya da {bilgiler...})
    login,   // Giriş yapma fonksiyonu
    logout,  // Çıkış yapma fonksiyonu
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Kasayı kullanmak için kolay bir "kanca" (hook)
// Component'ler bu fonksiyonu çağırarak kasaya erişecek
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
  }
  return context;
}