import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // useAuth'u tekrar dahil ediyoruz
import axios from 'axios';
import './LoginPage.css'; // Stil dosyasını import ediyoruz

// API adresimiz
const BaseURL = 'http://localhost:3000/api';

// E-posta ve telefon doğrulama fonksiyonları
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
function isValidPhone(phone) {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

export default function RegisterPage() {
  // State tanımlamaları
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Gerekli hook'lar
  const navigate = useNavigate();
  const { login } = useAuth(); // LoginPage'de olduğu gibi, useAuth'u güvenle kullanabiliriz.

  // Form elemanlarının değerini güncelleyen fonksiyon
  function handleChange(e) {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  // Doğum tarihi select kutularını güncelleyen fonksiyon
  function handleDateChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Form gönderildiğinde çalışacak ana fonksiyon
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Form Doğrulama
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      setLoading(false);
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      setLoading(false);
      return;
    }
    if (formData.phone && !isValidPhone(formData.phone)) {
      setError('Lütfen geçerli bir telefon numarası girin (10 veya 11 haneli).');
      setLoading(false);
      return;
    }
    
    // 2. Backend'e Gönderilecek Veriyi Hazırlama
    const newUser = {
      firstName: formData.firstName, 
      lastName: formData.lastName, 
      tcKimlik: formData.tc,
      email: formData.email,
      telephone: formData.phone,
      password: formData.password,
      birthDate: `${formData.year}-${formData.month.toString().padStart(2, '0')}-${formData.day.toString().padStart(2, '0')}`
    };

    try {
      // 3. KAYIT İŞLEMİ
      await axios.post(`${BaseURL}/users`, newUser);
      
      // 4. OTOMATİK GİRİŞ İŞLEMİ
      const loginResponse = await axios.post(`${BaseURL}/auth/login`, {
        tcKimlik: formData.tc,
        password: formData.password
      });

      // 5. OTURUMU BAŞLATMA
      login(loginResponse.data);
      
      // 6. ANASAYFAYA YÖNLENDİRME
      navigate('/');

    } catch (err) {
      // Hata Yönetimi
      console.error('Kayıt veya otomatik giriş hatası:', err);
      if (err.response) {
        setError(err.response.data?.message || `Sunucu hatası: ${err.response.status}`);
      } else if (err.request) {
        setError('Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edin.');
      } else {
        setError('Beklenmedik bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  }

  // --- Doğum Tarihi için Yardımcı Diziler ---
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: 'Ocak' }, { value: 2, name: 'Şubat' }, { value: 3, name: 'Mart' },
    { value: 4, name: 'Nisan' }, { value: 5, name: 'Mayıs' }, { value: 6, name: 'Haziran' },
    { value: 7, name: 'Temmuz' }, { value: 8, name: 'Ağustos' }, { value: 9, name: 'Eylül' },
    { value: 10, name: 'Ekim' }, { value: 11, name: 'Kasım' }, { value: 12, name: 'Aralık' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i); // Reşit olma kontrolü eklendi

  // --- JSX (HTML) KISMI ---
  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <h2 className="login-title">Kayıt Ol</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">Ad</label>
              <input type="text" id="firstName" className="form-input" value={formData.firstName} onChange={handleChange} disabled={loading} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Soyad</label>
              <input type="text" id="lastName" className="form-input" value={formData.lastName} onChange={handleChange} disabled={loading} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tc">TC Kimlik Numarası</label>
            <input type="text" id="tc" className="form-input" value={formData.tc} onChange={handleChange} disabled={loading} required pattern="\d{11}" title="TC Kimlik 11 haneli olmalıdır." />
          </div>

          <div className="form-group">
            <label>Doğum Tarihi</label>
            <div className="dob-group">
              <select name="day" className="form-input" value={formData.day} onChange={handleDateChange} disabled={loading} required>
                <option value="" disabled>Gün</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
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

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} disabled={loading} required />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon Numarası (İsteğe Bağlı)</label>
            <input type="tel" id="phone" className="form-input" value={formData.phone} onChange={handleChange} disabled={loading} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} disabled={loading} required minLength="6" />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrarı</label>
            <input type="password" id="confirmPassword" className="form-input" value={formData.confirmPassword} onChange={handleChange} disabled={loading} required />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="register-footer-link">
          Zaten hesabınız var mı? <Link to="/login" className="login-link">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}