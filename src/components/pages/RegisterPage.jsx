import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const BaseURL = "http://localhost:3000";

// --- YENİ ---
// E-posta formatını kontrol eden yardımcı fonksiyon (RegEx ile)
function isValidEmail(email) {
  // Basit bir regex: [karakterler]@[karakterler].[karakterler]
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

// Telefon formatını kontrol eden yardımcı fonksiyon
function isValidPhone(phone) {
  // Sadece rakamları al ve uzunluğunu kontrol et (10 veya 11 haneli, ör: 5xxxxxxxxx veya 05xxxxxxxxx)
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}
// --- YENİ BİTTİ ---

export default function RegisterPage() {
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
  
  const navigate = useNavigate();

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  }

  function handleDateChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- GÜNCELLENDİ ---
    // 1. Şifre Kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      setLoading(false);
      return;
    }

    // 2. E-posta Format Kontrolü
    if (!isValidEmail(formData.email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      setLoading(false);
      return;
    }

    // 3. Telefon Format Kontrolü (eğer girilmişse)
    if (formData.phone && !isValidPhone(formData.phone)) {
      setError('Lütfen geçerli bir telefon numarası girin (10 veya 11 haneli).');
      setLoading(false);
      return;
    }
    // --- GÜNCELLEME BİTTİ ---

    const newUser = {
      name: formData.firstName,
      surname: formData.lastName,
      tcKimlik: formData.tc,
      email: formData.email,
      telephone: formData.phone,
      password: formData.password,
      birthDate: `${formData.year}-${formData.month.toString().padStart(2, '0')}-${formData.day.toString().padStart(2, '0')}`
    };

    try {
      console.log('Backend\'e kayıt isteği gönderiliyor:', newUser);
      
      const response = await axios.post(`${BaseURL}/users`, newUser);
     
      console.log('Kayıt başarılı, dönen veri:', response.data);
      setLoading(false);
      
      alert('Kayıt başarılı! Lütfen giriş yapın.');
      navigate('/login');

    } catch (err) {
      console.error('Kayıt hatası:', err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message || `Sunucu hatası: ${err.response.status}`);
        } else if (err.request) {
          setError('Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edin.');
        } else {
          setError('Beklenmedik bir hata oluştu.');
        }
      } else {
        setError('Bilinmeyen bir hata oluştu.');
      }
      setLoading(false);
    }
  }

  // --- Doğum Tarihi için Yardımcı Diziler (değişiklik yok) ---
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: 'Ocak' }, { value: 2, name: 'Şubat' }, { value: 3, name: 'Mart' },
    { value: 4, name: 'Nisan' }, { value: 5, name: 'Mayıs' }, { value: 6, name: 'Haziran' },
    { value: 7, name: 'Temmuz' }, { value: 8, name: 'Ağustos' }, { value: 9, name: 'Eylül' },
    { value: 10, name: 'Ekim' }, { value: 11, name: 'Kasım' }, { value: 12, name: 'Aralık' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <h2 className="login-title">Kayıt Ol</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">Ad</label>
              <input type="text" id="firstName" className="form-input" placeholder="Adınız" value={formData.firstName} onChange={handleChange} disabled={loading} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Soyad</label>
              <input type="text" id="lastName" className="form-input" placeholder="Soyadınız" value={formData.lastName} onChange={handleChange} disabled={loading} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="tc">TC Kimlik Numarası</label>
            <input type="text" id="tc" className="form-input" placeholder="TC No girin" value={formData.tc} onChange={handleChange} disabled={loading} required pattern="\d{11}" title="TC Kimlik 11 haneli olmalıdır." />
          </div>
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
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input type="email" id="email" className="form-input" placeholder="E-posta adresiniz" value={formData.email} onChange={handleChange} disabled={loading} required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon Numarası</label>
            <input type="tel" id="phone" className="form-input" placeholder="5xx xxx xx xx" value={formData.phone} onChange={handleChange} disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input type="password" id="password" className="form-input" placeholder="Şifrenizi oluşturun" value={formData.password} onChange={handleChange} disabled={loading} required minLength="6" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrarı</label>
            <input type="password" id="confirmPassword" className="form-input" placeholder="Şifrenizi tekrar girin" value={formData.confirmPassword} onChange={handleChange} disabled={loading} required />
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