// src/components/pages/RegisterPage.jsx (YENİ TASARIMA GÖRE SON HALİ)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// DİKKAT: Paylaşımlı CSS'i import ediyoruz
import './LoginPage.css'; 

export default function RegisterPage() {
  // Formdaki tüm alanlar için bir state objesi
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tc: '',
    day: '',
    month: '',
    year: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // UI durumları
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Formdaki input'lar değiştikçe state'i güncelleyen genel fonksiyon
  function handleChange(e) {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  }

  // Doğum tarihi <select>leri için ayrı bir fonksiyon
  function handleDateChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Kayıt formunu gönderme (Simülasyon)
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basit bir şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      setLoading(false);
      return;
    }
    
    // Alanların boş olup olmadığını da kontrol edebilirsin...
    
    console.log('Backend\'e kayıt isteği gönderiliyor:', formData);
    
    // 2 saniyelik sahte ağ gecikmesi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    
    // Başarılı kayıt simülasyonu
    alert('Kayıt başarılı! Lütfen giriş yapın.');
    navigate('/login'); // Kullanıcıyı giriş sayfasına yönlendir
  }

  // --- Doğum Tarihi için Helper Diziler ---
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: 'Ocak' }, { value: 2, name: 'Şubat' }, { value: 3, name: 'Mart' },
    { value: 4, name: 'Nisan' }, { value: 5, name: 'Mayıs' }, { value: 6, name: 'Haziran' },
    { value: 7, name: 'Temmuz' }, { value: 8, name: 'Ağustos' }, { value: 9, name: 'Eylül' },
    { value: 10, name: 'Ekim' }, { value: 11, name: 'Kasım' }, { value: 12, name: 'Aralık' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  // ---

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        
        <h2 className="login-title">Kayıt Ol</h2>
        
        <form className="login-form" onSubmit={handleSubmit}>
          
          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Ad */}
          <div className="form-group">
            <label htmlFor="firstName">Ad</label>
            <input type="text" id="firstName" className="form-input" placeholder="Adınızı girin" value={formData.firstName} onChange={handleChange} disabled={loading} required />
          </div>

          {/* Soyad */}
          <div className="form-group">
            <label htmlFor="lastName">Soyad</label>
            <input type="text" id="lastName" className="form-input" placeholder="Soyadınızı girin" value={formData.lastName} onChange={handleChange} disabled={loading} required />
          </div>

          {/* TC */}
          <div className="form-group">
            <label htmlFor="tc">TC</label>
            <input type="text" id="tc" className="form-input" placeholder="TC No girin" value={formData.tc} onChange={handleChange} disabled={loading} required />
          </div>

          {/* Doğum Tarihi */}
          <div className="form-group">
            <label>Doğum Tarihi</label>
            <div className="dob-group">
              <select name="day" className="form-input" value={formData.day} onChange={handleDateChange} disabled={loading} required>
                <option value="" disabled>Gün</option>
                {days.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
              <select name="month" className="form-input" value={formData.month} onChange={handleDateChange} disabled={loading} required>
                <option value="" disabled>Ay</option>
                {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
              </select>
              <select name="year" className="form-input" value={formData.year} onChange={handleDateChange} disabled={loading} required>
                <option value="" disabled>Yıl</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Mail */}
          <div className="form-group">
            <label htmlFor="email">Mail</label>
            <input type="email" id="email" className="form-input" placeholder="Mail adresinizi girin" value={formData.email} onChange={handleChange} disabled={loading} required />
          </div>

          {/* Telefon */}
          <div className="form-group">
            <label htmlFor="phone">Telefon Numarası</label>
            <input type="tel" id="phone" className="form-input" placeholder="Telefon numaranızı girin" value={formData.phone} onChange={handleChange} disabled={loading} required />
          </div>
          
          {/* Şifre */}
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" className="form-input" placeholder="Şifrenizi girin" value={formData.password} onChange={handleChange} disabled={loading} required />
          </div>

          {/* Şifre Tekrarı */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrarı</label>
            <input type="password" id="confirmPassword" className="form-input" placeholder="Şifrenizi tekrar girin" value={formData.confirmPassword} onChange={handleChange} disabled={loading} required />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </button>
          
        </form>
        
        {/* Ekran görüntüsündeki alt link */}
        <div className="register-footer-link">
          Zaten hesabınız var mı? <Link to="/login" className="login-link">Giriş Yap</Link>
        </div>
        
      </div>
    </div>
  );
}