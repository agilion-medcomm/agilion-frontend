import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function LoginPage() {
  // tckn dışında tcKimlik kullanılmaz!
  const [tckn, setTckn] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { user: personnelUser } = usePersonnelAuth();

  useEffect(() => {
    if (personnelUser) {
      switch (personnelUser.role) {
        case 'ADMIN': navigate('/personelLogin/admin-panel', { replace: true }); break;
        case 'DOCTOR': navigate('/personelLogin/doctor-panel', { replace: true }); break;
        case 'LAB_TECHNICIAN': navigate('/personelLogin/lab-panel', { replace: true }); break;
        case 'CASHIER': navigate('/personelLogin/cashier-panel', { replace: true }); break;
        case 'CLEANER': navigate('/personelLogin/cleaner-panel', { replace: true }); break;
        default: break;
      }
    }
  }, [personnelUser, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const normalizedTckn = (tckn || '').replace(/\D/g, '');
    if (!normalizedTckn || normalizedTckn.length !== 11) {
      setError('Lütfen 11 haneli geçerli bir TC kimlik numarası girin.');
      return;
    }

    setLoading(true);

    try {
      // tckn olarak gönder
      const payload = { tckn: normalizedTckn, password };
      const response = await axios.post(`${BaseURL}/auth/patient/login`, payload);
      const data = response.data?.data;
      if (!data?.token || !data?.user) throw new Error('Sunucudan token veya user gelmedi.');

      await login(data.token, data.user);
      navigate('/');
    } catch (err) {
      if (err.response) setError(err.response.data?.message || 'Giriş başarısız.');
      else if (err.request) setError('Sunucuya ulaşılamıyor.');
      else setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }

  if (personnelUser) return null;

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">Hasta Girişi</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="form-group">
            <label htmlFor="tckn">TC Kimlik No</label>
            <input
              type="text"
              id="tckn"
              className="form-input"
              value={tckn}
              maxLength={11}
              minLength={11}
              onChange={(e) => setTckn(e.target.value)}
              disabled={loading}
              pattern="\d{11}"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <div className="login-footer-link">
          Hesabınız yok mu? <Link to="/register" className="login-link">Kaydol</Link>
        </div>
      </div>
    </div>
  );
}