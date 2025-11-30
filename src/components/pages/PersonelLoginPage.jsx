import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Context import yolunuzun doğru olduğundan emin olun
import { usePersonnelAuth } from '../../context/PersonnelAuthContext'; 
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function PersonelLoginPage() {
  const [tckn, setTckn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  
  // Context'ten fonksiyonları alıyoruz (Harf duyarlılığına dikkat!)
  const { loginPersonnel, logoutPersonnel } = usePersonnelAuth();

  // Sayfa açıldığında eski oturumu temizle
  useEffect(() => { 
    if (logoutPersonnel) {
      logoutPersonnel(); 
    }
  }, []); 

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Backend'e Giriş İsteği (Endpoint ismine dikkat)
      const response = await axios.post(`${BaseURL}/auth/personnel/login`, { 
        tckn: tckn.replace(/\D/g, ''), 
        password 
      });
      
      const data = response.data?.data; 

      // 2. Context'e Giriş Yap (Token 'personnelToken' olarak kaydedilir)
      await loginPersonnel(data.token, data.user);
      
      // 3. Redirect to new dashboard system
      navigate('/dashboard');

    } catch (err) {
      console.error('Giriş Hatası:', err);
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px', borderTop: '4px solid #c1272d' }}> 
        <h2 className="login-title">Personel Girişi</h2>
        <p style={{textAlign:'center', color:'#666', fontSize:'0.9rem', marginBottom:'20px'}}>
          Doktor, Yönetici ve Diğer Personel Girişi
        </p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>TC Kimlik No</label>
            <input 
              type="text" 
              className="form-input" 
              value={tckn} 
              onChange={(e) => setTckn(e.target.value)} 
              maxLength={11} 
              required 
              placeholder="11 haneli TCKN"
            />
          </div>
          
          <div className="form-group">
            <label>Şifre</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Şifreniz"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading} style={{ backgroundColor: '#c1272d' }}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}