import React, { useState } from 'react';
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

// API Ayarları
=======
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './LoginPage.css';

// API setup
>>>>>>> main
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

// E-posta ve telefon doğrulama yardımcı fonksiyonları
function isValidEmail(email) {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
}
<<<<<<< HEAD

function isValidPhoneNumber(phoneNumber) {
  // Sadece rakamları al
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  // 10 veya 11 hane kontrolü (Başında 0 olup olmamasına göre)
=======
function isValidPhoneNumber(phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, '');
>>>>>>> main
  return digitsOnly.length >= 10 && digitsOnly.length <= 11;
}

export default function RegisterPage() {
<<<<<<< HEAD
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tckn: '',
=======
  // DATALARDA sadece tckn ve phoneNumber’a göre state tutuluyor
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tckn: '',               // tc yerine tckn
>>>>>>> main
    day: '',
    month: '',
    year: '',
    email: '',
<<<<<<< HEAD
    phoneNumber: '',
=======
    phoneNumber: '',        // phone yerine phoneNumber
>>>>>>> main
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
<<<<<<< HEAD
  const [success, setSuccess] = useState(false); // Başarı durumu

=======

  const navigate = useNavigate();
  const { login } = useAuth();

>>>>>>> main
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

<<<<<<< HEAD
    // --- İstemci Tarafı Doğrulamaları ---
=======
    // Doğrulamalar
>>>>>>> main
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
<<<<<<< HEAD
      setError('Lütfen geçerli bir telefon numarası girin.');
      setLoading(false);
      return;
    }
    // Tarih kontrolü
    if (!formData.day || !formData.month || !formData.year) {
        setError('Lütfen doğum tarihinizi eksiksiz girin.');
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
=======
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
>>>>>>> main
      dateOfBirth: `${formData.year}-${formData.month.toString().padStart(2, '0')}-${formData.day.toString().padStart(2, '0')}`
    };

    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> main
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

<<<<<<< HEAD
  // Doğum Tarihi dropdownları için yardımcı diziler
=======
  // Doğum Tarihi için yardımcı diziler
>>>>>>> main
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, name: 'Ocak' }, { value: 2, name: 'Şubat' }, { value: 3, name: 'Mart' },
    { value: 4, name: 'Nisan' }, { value: 5, name: 'Mayıs' }, { value: 6, name: 'Haziran' },
    { value: 7, name: 'Temmuz' }, { value: 8, name: 'Ağustos' }, { value: 9, name: 'Eylül' },
    { value: 10, name: 'Ekim' }, { value: 11, name: 'Kasım' }, { value: 12, name: 'Aralık' }
  ];
  const currentYear = new Date().getFullYear();
<<<<<<< HEAD
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i); // 18 yaşından büyükler için

  // --- RENDERING ---

  // Eğer kayıt başarılıysa bu ekranı göster
  if (success) {
    return (
      <div className="login-container">
        <div className="login-box" style={{ maxWidth: '500px', textAlign: 'center', padding: '50px 30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px', color: '#4ab43f' }}>📧</div>
          <h2 className="login-title" style={{ marginBottom: '20px', color: '#0e2b4b' }}>Kayıt Başarılı!</h2>
          
          <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
            Aramıza hoş geldiniz. Kaydınız başarıyla alındı.<br />
            Hesabınızı aktifleştirmek ve giriş yapabilmek için lütfen <strong>e-posta adresinize</strong> gönderdiğimiz doğrulama bağlantısına tıklayın.
          </p>
          
          <div className="login-footer-link">
            <Link to="/login" className="login-button" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 30px', backgroundColor: '#0e2b4b' }}>
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normal Kayıt Formu
=======
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

>>>>>>> main
  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '500px' }}>
        <h2 className="login-title">Kayıt Ol</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

<<<<<<< HEAD
          <div className="form-group-row" style={{ display: 'flex', gap: '15px' }}>
=======
          <div className="form-group-row">
>>>>>>> main
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
<<<<<<< HEAD
              placeholder="11 haneli TC kimlik no"
=======
>>>>>>> main
            />
          </div>

          <div className="form-group">
            <label>Doğum Tarihi</label>
<<<<<<< HEAD
            <div className="dob-group" style={{ display: 'flex', gap: '10px' }}>
=======
            <div className="dob-group">
>>>>>>> main
              <select
                name="day"
                className="form-input"
                value={formData.day}
                onChange={handleDateChange}
                disabled={loading}
                required
<<<<<<< HEAD
                style={{ flex: 1 }}
=======
>>>>>>> main
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
<<<<<<< HEAD
                style={{ flex: 1 }}
=======
>>>>>>> main
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
<<<<<<< HEAD
                style={{ flex: 1 }}
=======
>>>>>>> main
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
<<<<<<< HEAD
              placeholder="ornek@email.com"
=======
>>>>>>> main
            />
          </div>

          <div className="form-group">
<<<<<<< HEAD
            <label htmlFor="phoneNumber">Telefon Numarası</label>
=======
            <label htmlFor="phoneNumber">Telefon Numarası (İsteğe Bağlı)</label>
>>>>>>> main
            <input
              type="tel"
              id="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
<<<<<<< HEAD
              placeholder="05XX XXX XX XX"
=======
>>>>>>> main
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
<<<<<<< HEAD
              placeholder="En az 8 karakter"
=======
>>>>>>> main
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
<<<<<<< HEAD
              placeholder="Şifrenizi tekrar girin"
=======
>>>>>>> main
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