import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function LoginPage() {
  const { t } = useTranslation(['login', 'common']);
  const [tcKimlik, setTcKimlik] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  function withoutPassword(user) {
    if (!user || typeof user !== 'object') return user;

    const { password: pw, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const normalizedTckn = (tcKimlik || '').replace(/\D/g, '');
    if (!normalizedTckn || normalizedTckn.length !== 11) {
      setError(t('login:validation.tckn_invalid'));
      return;
    }

    if (!password || password.length < 8) {
      setError(t('login:validation.password_too_short'));
      return;
    }

    setLoading(true);

    try {

      console.log('Gönderilen (POST):', { tcKimlik, password });

      const payload = { tckn: normalizedTckn, password };
      console.log('Login payload:', payload);
      const response = await axios.post(`${BaseURL}/auth/login`, payload);

      console.log('Login başarılı (POST), response:', response.data);

      const { token, user } = response.data?.data || response.data;

      if (!token) {
        throw new Error(t('login:error.no_token'));
      }

      await login({ token, user });
      navigate('/');

    } catch (err) {

      if (axios.isAxiosError(err)) {

        if (err.response && err.response.status === 404) {
          console.warn('/api/auth/login 404 verdi. Fallback: /api/v1/patients üzerinden client-side doğrulama deneniyor...');
          try {
            const usersResponse = await axios.get(`${BaseURL}/patients`);
            const users = usersResponse.data && usersResponse.data.users ? usersResponse.data.users : usersResponse.data;

            const user = users.find(u =>
              (u.tckn === tcKimlik || u.tcKimlik === tcKimlik || u.identy_number === tcKimlik) && u.password === password
            );

            if (user) {
              console.log('Fallback login başarılı (mock token). user:', user);
              const mockToken = `mock-token-${user.id}-${Date.now()}`;
              login({ token: mockToken, user: withoutPassword(user) });
              navigate('/');
            } else {
              setError(t('login:error.invalid_credentials'));
            }
          } catch (fallbackErr) {
            console.error('Fallback GET /patients hatası:', fallbackErr);
            setError(t('login:error.fetch_failed'));
          }
        } else if (err.response) {

          console.error('API Hatası:', err.response.status, err.response.data);

          const respData = err.response.data;
          if (respData && respData.errors && Array.isArray(respData.errors) && respData.errors.length) {
            setError(respData.errors.map(e => e.message).join('; '));
          } else {
            setError(respData?.message || t('common:server_error_with_status', { status: err.response.status }));
          }
        } else if (err.request) {

          console.error('Network Hatası:', err.request);
          setError(t('login:error.network'));
        } else {

          console.error('Beklenmedik Hata:', err.message);
          setError(t('login:error.unexpected'));
        }
      } else {

        console.error('Genel Hata:', err);
        setError(err.message || t('login:error.unknown'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">{t('login:title')}</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="form-group">
            <label htmlFor="tcKimlik">{t('common:username')}</label>
            <input
              type="text"
              id="tcKimlik"
              className="form-input"
              placeholder={t('login:placeholders.tckn')}
              value={tcKimlik}

              maxLength={11}
              onChange={(e) => {

                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 11) {
                  setTcKimlik(val);
                }
              }}
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('common:password')}</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder={t('login:placeholders.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? t('login:button_loading') : t('common:login')}
          </button>
        </form>

        <div className="login-footer-links" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <div className="login-footer-link" style={{ marginTop: '0' }}>
            {t('login:no_account')} <Link to="/register" className="login-link" style={{ color: '#0d6efd', fontWeight: 'bold' }}>{t('common:register')}</Link>
          </div>
          <Link to="/forgot-password" className="login-link" style={{ fontSize: '14px', color: '#0d6efd', textDecoration: 'none' }}>
            {t('login:forgot_password')}
          </Link>
          <Link to="/resend-verification" className="login-link" style={{ fontSize: '14px', color: '#0d6efd', textDecoration: 'none' }}>
            {t('login:resend_verification_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}
