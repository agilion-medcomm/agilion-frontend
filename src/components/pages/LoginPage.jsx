// src/components/pages/LoginPage.jsx (YENİ TASARIMA GÖRE SON HALİ)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css'; // Yeni tasarımları içeren paylaşımlı CSS

export default function LoginPage() {
  // Form verileri
  const [tcKimlik, setTcKimlik] = useState('');
  const [password, setPassword] = useState('');
  
  // UI durumları
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  // Form gönderme (Tüm mantık aynı kalıyor)
  async function handleSubmit(event) {
    event.preventDefault(); 
    if (loading) return; 
    
    setLoading(true);
    setError('');     
    
    // Simülasyon
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    setLoading(false); 
    
    if (tcKimlik === '11111111111' && password === '123456') {
      const sahteKullaniciVerisi = { name: "Ahmet Furkan", initials: "AF" };
      login(sahteKullaniciVerisi);
      navigate('/'); 
    } else {
      setError('T.C. Kimlik Numarası veya Şifre Hatalı.');
    }
  }
  
  return (
    // 'login-container' class'ı CSS'ten arkaplanı ve ortalamayı alacak
    <div className="login-container">
      {/* 'login-box' beyaz kartın kendisi */}
      <div className="login-box" style={{ maxWidth: '440px' }}>
        
        <h2 className="login-title">Giriş Yap</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          
          {error && (
            <div className="error-message">{error}</div>
          )}
          
          <div className="form-group">
            <label htmlFor="tcKimlik">Kullanıcı Adı (TC No)</label>
            <input 
              type="text" 
              id="tcKimlik" 
              className="form-input" 
              placeholder="TC No girin"
              value={tcKimlik} 
              onChange={(e) => setTcKimlik(e.target.value)}
              disabled={loading} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              placeholder="Şifre girin"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} 
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" // Bu class'ın stili CSS'te koyu mavi olacak
            disabled={loading} 
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
          
        </form>
        
        {/* Ekran görüntüsündeki alt link */}
        <div className="login-footer-link">
          Hesabınız yok mu? <Link to="/register" className="login-link">Kaydol</Link>
        </div>
        
      </div>
    </div>
  );
}