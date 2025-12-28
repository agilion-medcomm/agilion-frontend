import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function PersonelLoginPage() {
  const [tckn, setTckn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { loginPersonnel, user } = usePersonnelAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const handlePopState = () => {
      navigate('/', { replace: true });
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {

      const response = await axios.post(`${BaseURL}/auth/personnel/login`, {
        tckn: tckn.replace(/\D/g, ''),
        password
      });

      const data = response.data?.data;

      await loginPersonnel(data.token, data.user);

      navigate('/dashboard');

    } catch (err) {
      console.error('Giriş Hatası:', err);
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container standalone">
      <div className="login-box" style={{ maxWidth: '440px', borderTop: '3px solid #1755ffff' }}>
        <h2 className="login-title">Personel Girişi</h2>
        <p className="login-subtitle">
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

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a
              href="/"
              style={{ color: '#7f7f7fff', fontSize: '0.9rem', textDecoration: 'none' }}
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              ← Ana Sayfaya Dön
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
