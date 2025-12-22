import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './LoginPage.css';

// API Ayarları
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

// E-posta ve telefon doğrulama yardımcı fonksiyonları
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  // Sadece rakamları al
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  // 10 veya 11 hane kontrolü (Başında 0 olup olmamasına göre)
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

export default function RegisterPage() {
  const { t } = useTranslation(['auth', 'common']);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tckn: '',
    day: '',
    month: '',
    year: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Başarı durumu

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

    // --- İstemci Tarafı Doğrulamaları ---
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth:register.errors.password_mismatch'));
      setLoading(false);
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError(t('auth:register.errors.invalid_email'));
      setLoading(false);
      return;
    }
    if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) {
      setError(t('auth:register.errors.invalid_phone'));
      setLoading(false);
      return;
    }
    // Tarih kontrolü
    if (!formData.day || !formData.month || !formData.year) {
      setError(t('auth:register.errors.incomplete_dob'));
      setLoading(false);
      return;
    }

    // Backend'e gönderilecek veri formatı
    const newUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      tckn: formData.tckn.replace(/\D/g, ''), // Sadece rakamlar
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      // Tarih formatı: YYYY-MM-DD
      dateOfBirth: `${formData.year}-${formData.month.toString().padStart(2, '0')}-${formData.day.toString().padStart(2, '0')}`
    };

    try {
      // 1. Kayıt İsteği Gönder
      await axios.post(`${BaseURL}/auth/register`, newUser);

      // 2. Başarılı ise Success ekranına geç
      setSuccess(true);

      // Formu temizle (Güvenlik ve temizlik için)
      setFormData({
        firstName: '', lastName: '', tckn: '', day: '', month: '', year: '',
        email: '', phoneNumber: '', password: '', confirmPassword: ''
      });

    } catch (err) {
      console.error('Kayıt hatası:', err);
      if (err.response) {
        // Backend'den gelen hata mesajını göster
        const resp = err.response.data;
        if (resp && resp.errors && Array.isArray(resp.errors) && resp.errors.length) {
          setError(resp.errors.map(e => e.message).join('; '));
        } else {
          setError(resp?.message || `Sunucu hatası: ${err.response.status}`);
        }
      } else if (err.request) {
        setError(t('auth:register.errors.network'));
      } else {
        setError(t('auth:register.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  }

  // Doğum Tarihi dropdownları için yardımcı diziler
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: t('auth:months.jan') }, { value: 2, name: t('auth:months.feb') }, { value: 3, name: t('auth:months.mar') },
    { value: 4, name: t('auth:months.apr') }, { value: 5, name: t('auth:months.may') }, { value: 6, name: t('auth:months.jun') },
    { value: 7, name: t('auth:months.jul') }, { value: 8, name: t('auth:months.aug') }, { value: 9, name: t('auth:months.sep') },
    { value: 10, name: t('auth:months.oct') }, { value: 11, name: t('auth:months.nov') }, { value: 12, name: t('auth:months.dec') }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i); // 18 yaşından büyükler için

  // --- RENDERING ---

  // Eğer kayıt başarılıysa bu ekranı göster
  if (success) {
    return (
      <div className="login-container">
        <div className="login-box" style={{ maxWidth: '500px', textAlign: 'center', padding: '50px 30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', color: '#4ab43f' }}>📧</div>
          <h2 className="login-title" style={{ marginBottom: '20px', color: '#0e2b4b' }}>{t('auth:register.success.title')}</h2>

          <p
            style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}
            dangerouslySetInnerHTML={{ __html: t('auth:register.success.text') }}
          />

          <div className="login-footer-link">
            <Link to="/login" className="login-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 30px', backgroundColor: '#0e2b4b' }}>
              {t('auth:register.success.button')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal Kayıt Formu
  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <h2 className="login-title">{t('auth:register.title')}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="firstName">{t('auth:register.form.first_name')}</label>
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
          <div className="form-group">
            <label htmlFor="lastName">{t('auth:register.form.last_name')}</label>
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

          <div className="form-group">
            <label htmlFor="tckn">{t('auth:register.form.tckn')}</label>
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
              placeholder={t('auth:register.form.tckn_placeholder')}
            />
          </div>

          <div className="form-group">
            <label>{t('auth:register.form.dob')}</label>
            <div className="dob-group" style={{ display: 'flex', gap: '10px' }}>
              <select
                name="day"
                className="form-input"
                value={formData.day}
                onChange={handleDateChange}
                disabled={loading}
                required
                style={{ flex: 1 }}
              >
                <option value="" disabled>{t('auth:register.form.day')}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                name="month"
                className="form-input"
                value={formData.month}
                onChange={handleDateChange}
                disabled={loading}
                required
                style={{ flex: 1 }}
              >
                <option value="" disabled>{t('auth:register.form.month')}</option>
                {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
              </select>
              <select
                name="year"
                className="form-input"
                value={formData.year}
                onChange={handleDateChange}
                disabled={loading}
                required
                style={{ flex: 1 }}
              >
                <option value="" disabled>{t('auth:register.form.year')}</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('auth:register.form.email')}</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="ornek@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">{t('auth:register.form.phone')}</label>
            <input
              type="tel"
              id="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
              placeholder="05XX XXX XX XX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth:register.form.password')}</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              minLength="8"
              placeholder={t('auth:register.form.password_placeholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth:register.form.confirm_password')}</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder={t('auth:register.form.confirm_password_placeholder')}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('auth:register.form.loading') : t('auth:register.form.submit')}
          </button>
        </form>

        <div className="register-footer-link">
          {t('auth:register.footer_text')} <Link to="/login" className="login-link">{t('auth:register.footer_link')}</Link>
        </div>
      </div>
    </div>
  );
}