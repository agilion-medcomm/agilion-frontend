import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BaseURL}/auth/request-password-reset`, {
        email: email.trim(),
      });

      if (response.data?.status === 'success') {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'İstek başarısız oldu.');
      } else if (err.request) {
        setError('Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">Şifremi Unuttum</h2>

        {success ? (
          <div className="success-message">
            <p>
              E-posta adresiniz kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.
              Lütfen e-posta kutunuzu kontrol edin.
            </p>
            <div className="login-footer-link" style={{ marginTop: '24px' }}>
              <Link to="/login" className="login-link">Giriş sayfasına dön</Link>
            </div>
          </div>
        ) : (
          <>
            <p className="login-subtitle">
              E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="error-message" role="alert">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">E-posta Adresi</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </button>
            </form>

            <div className="login-footer-link">
              Şifrenizi hatırladınız mı? <Link to="/login" className="login-link">Giriş Yap</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
