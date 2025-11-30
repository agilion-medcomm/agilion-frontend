import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './LoginPage.css';

// API setup
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

// E-posta ve telefon doğrulama yardımcı fonksiyonları
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
function isValidPhoneNumber(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

export default function RegisterPage() {
  // DATALARDA sadece tckn ve phoneNumber’a göre state tutuluyor
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tckn: '',               // tc yerine tckn
    day: '',
    month: '',
    year: '',
    email: '',
    phoneNumber: '',        // phone yerine phoneNumber
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

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

    // Doğrulamalar
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
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      setError('Lütfen geçerli bir telefon numarası girin (10 veya 11 haneli).');
      setLoading(false);
      return;
    }

    // YENİ KULLANICI DATASI: sadece gerekli alanlarla ve tckn + phoneNumber ile
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      tckn: formData.tckn.replace(/\D/g, ''),
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      dateOfBirth: `${formData.year}-${formData.month.toString().padStart(2, '0')}-${formData.day.toString().padStart(2, '0')}`
    };

    try {
      // KAYIT OL
      await axios.post(`${BaseURL}/auth/register`, newUser);

      // OTO-GİRİŞ
      const loginPayload = { tckn: newUser.tckn, password: formData.password };
      const loginResponse = await axios.post(`${BaseURL}/auth/login`, loginPayload);

      // Token ve (tercihen) user objesi alınır (user destekli ise kullan)
      const { token, user } = loginResponse.data?.data || {};
      if (!token) throw new Error('Giriş tokenı alınamadı.');

      // login fonksiyonun token ve user destekliyorsa:
      if (user) {
        await login(token, user);
      } else {
        await login(token);
      }

      navigate('/');
    } catch (err) {
      console.error('Kayıt veya otomatik giriş hatası:', err);
      if (err.response) {
        // Backend'den gelen hata mesajını göster
        const resp = err.response.data;
        if (resp && resp.errors && Array.isArray(resp.errors) && resp.errors.length) {
          setError(resp.errors.map(e => e.message).join('; '));
        } else {
          setError(resp?.message || `Sunucu hatası: ${err.response.status}`);
        }
      } else if (err.request) {
        setError('Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edin.');
      } else {
        setError('Beklenmedik bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Doğum Tarihi için yardımcı diziler
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: 'Ocak' }, { value: 2, name: 'Şubat' }, { value: 3, name: 'Mart' },
    { value: 4, name: 'Nisan' }, { value: 5, name: 'Mayıs' }, { value: 6, name: 'Haziran' },
    { value: 7, name: 'Temmuz' }, { value: 8, name: 'Ağustos' }, { value: 9, name: 'Eylül' },
    { value: 10, name: 'Ekim' }, { value: 11, name: 'Kasım' }, { value: 12, name: 'Aralık' }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <h2 className="login-title">Kayıt Ol</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="firstName">Ad</label>
              <input
                type="text"
                id="firstName"
                className="form-input"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="lastName">Soyad</label>
              <input
                type="text"
                id="lastName"
                className="form-input"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tckn">TC Kimlik Numarası</label>
            <input
              type="text"
              id="tckn"
              className="form-input"
              value={formData.tckn}
              onChange={handleChange}
              disabled={loading}
              required
              pattern="\d{11}"
              title="TC Kimlik 11 haneli olmalıdır."
              maxLength={11}
              minLength={11}
            />
          </div>

          <div className="form-group">
            <label>Doğum Tarihi</label>
            <div className="dob-group">
              <select
                name="day"
                className="form-input"
                value={formData.day}
                onChange={handleDateChange}
                disabled={loading}
                required
              >
                <option value="" disabled>Gün</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                name="month"
                className="form-input"
                value={formData.month}
                onChange={handleDateChange}
                disabled={loading}
                required
              >
                <option value="" disabled>Ay</option>
                {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
              </select>
              <select
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleDateChange}
                disabled={loading}
                required
              >
                <option value="" disabled>Yıl</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Telefon Numarası (İsteğe Bağlı)</label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Şifre Tekrarı</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="register-footer-link">
          Zaten hesabınız var mı? <Link to="/login" className="login-link">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
}