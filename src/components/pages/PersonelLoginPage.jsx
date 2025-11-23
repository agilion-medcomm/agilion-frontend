// src/components/pages/PersonelLoginPage.jsx (GEÇMİŞİ KORUYAN VERSİYON)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../context/StaffAuthContext'; 
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
  // logoutStaff fonksiyonunu da çekiyoruz
  const { loginStaff, logoutStaff, user: staffUser } = useStaffAuth();

  // 🔥 GÜVENLİK (AUTO-LOGOUT): 
  // Eğer kullanıcı Panel'den "Geri" tuşuna basarak bu sayfaya düşerse,
  // sistem onu yakalayıp çıkışını yapar.
  useEffect(() => {
    if (staffUser) {
      logoutStaff(); 
    }
  }, []); // Sadece sayfa ilk açıldığında çalışır

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const normalizedTckn = (tckn || '').replace(/\D/g, '');
    if (!normalizedTckn || normalizedTckn.length !== 11) {
      setError('Lütfen 11 haneli geçerli bir TC kimlik numarası girin.');
      return;
    }
    if (!password || password.length < 8) {
      setError('Lütfen en az 8 karakterli bir şifre girin.');
      return;
    }

    setLoading(true);

    try {
      const payload = { tckn: normalizedTckn, password };
      const response = await axios.post(`${BaseURL}/auth/staff-login`, payload);
      const data = response.data?.data; 
      
      if (!data || !data.token) throw new Error('Token alınamadı.');

      await loginStaff(data.token);
      
      // 🔥 DÜZELTME BURADA: replace: true KALDIRILDI 🔥
      // Artık tarayıcı geçmişi şöyle olacak: [Login Sayfası] -> [Panel]
      // Geri tuşuna bastığında [Login Sayfası]'na dönebileceksin.
      const role = data.user?.role || data.role;
      switch (role) {
        case 'ADMIN': navigate('/personelLogin/admin-panel'); break;
        case 'DOCTOR': navigate('/personelLogin/doctor-panel'); break;
        case 'LAB_TECHNICIAN': navigate('/personelLogin/lab-panel'); break;
        case 'CASHIER': navigate('/personelLogin/cashier-panel'); break;
        case 'CLEANER': navigate('/personelLogin/cleaner-panel'); break;
        default: setError('Yetkisiz giriş.');
      }

    } catch (err) {
      console.error('Giriş Hatası:', err);
      if (err.response) setError(err.response.data?.message || 'Giriş başarısız.');
      else setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px', borderTop: '4px solid #c1272d' }}> 
        <h2 className="login-title">Personel Girişi</h2>
        <p style={{textAlign:'center', color:'#666', marginBottom:'20px', fontSize:'0.9rem'}}>
          Yetkili personel giriş ekranıdır.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="form-group">
            <label htmlFor="tckn">TC Kimlik No</label>
            <input type="text" id="tckn" className="form-input" value={tckn} onChange={(e) => setTckn(e.target.value)} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
          </div>
          <button type="submit" className="login-button" disabled={loading} style={{ backgroundColor: '#c1272d' }}>
            {loading ? 'Giriş Yapılıyor...' : 'Personel Girişi Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}