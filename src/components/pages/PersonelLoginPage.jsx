<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
// src/components/pages/PersonelLoginPage.jsx

>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
  
  // Context'ten fonksiyonları alıyoruz (Harf duyarlılığına dikkat!)
  const { loginPersonnel, logoutPersonnel } = usePersonnelAuth();

  // Sayfa açıldığında eski oturumu temizle
  useEffect(() => { 
    if (logoutPersonnel) {
      logoutPersonnel(); 
    }
<<<<<<< HEAD
=======
=======
  const { loginStaff, logoutStaff } = useStaffAuth();

  // Sayfa yüklendiğinde (veya geri gelindiğinde) oturumu kapat
  useEffect(() => {
    logoutStaff();
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
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

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
      // 2. Context'e Giriş Yap (Token 'personnelToken' olarak kaydedilir)
      await loginPersonnel(data.token, data.user);
      
      // 3. Rolüne göre yönlendir
<<<<<<< HEAD
      const userRole = data.user.role; 
=======
      const userRole = data.role; 
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a

      switch (userRole) {
        case 'ADMIN': 
          navigate('/admin-panel'); 
          break;
        case 'DOCTOR': 
          navigate('/doctor-panel'); 
          break;
        case 'LAB_TECHNICIAN': 
          navigate('/lab-panel'); 
          break;
        case 'CASHIER': 
          navigate('/cashier-panel'); 
          break;
        case 'CLEANER': 
          navigate('/cleaner-panel'); 
          break;
        default: 
          setError('Rol tanımlı değil, lütfen yöneticiye başvurun.');
          if(logoutPersonnel) logoutPersonnel();
<<<<<<< HEAD
=======
=======
      await loginStaff(data.token, data.user);
      
      const role = data.user?.role || data.role;
      
      // 🔥 DÜZELTME BURADA: { replace: true } KALDIRILDI.
      // Artık "Geri" tuşuyla tekrar bu sayfaya dönülebilir.
      switch (role) {
        case 'ADMIN': navigate('/admin-panel'); break;
        case 'DOCTOR': navigate('/doctor-panel'); break;
        case 'LAB_TECHNICIAN': navigate('/lab-panel'); break;
        case 'CASHIER': navigate('/cashier-panel'); break;
        case 'CLEANER': navigate('/cleaner-panel'); break;
        default: setError('Yetkisiz giriş: Rol tanımlı değil.');
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
      }

    } catch (err) {
      console.error('Giriş Hatası:', err);
<<<<<<< HEAD
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
=======
<<<<<<< HEAD
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
=======
      if (err.response) setError(err.response.data?.message || 'Giriş başarısız.');
      else setError('Sunucuya bağlanılamadı.');
      logoutStaff();
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
            <label>TC Kimlik No</label>
            <input 
              type="text" 
              className="form-input" 
              value={tckn} 
              onChange={(e) => setTckn(e.target.value)} 
              maxLength={11} 
              required 
<<<<<<< HEAD
=======
=======
            <label htmlFor="tckn">TC Kimlik No</label>
            <input 
              type="text" 
              id="tckn" 
              className="form-input" 
              value={tckn} 
              onChange={(e) => setTckn(e.target.value)} 
              disabled={loading}
              maxLength={11}
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
              placeholder="11 haneli TCKN"
            />
          </div>
          
          <div className="form-group">
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
            <label>Şifre</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Şifreniz"
<<<<<<< HEAD
=======
=======
            <label htmlFor="password">Şifre</label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading} 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
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