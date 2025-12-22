import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios'; // axios import edildi
import './LoginPage.css';

// API base (env ile kolayca değiştirilebilir)
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
// Backend mounts routes under /api/v1
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

  // Kullanıcı objesinden parola alanını kaldıran yardımcı fonksiyon
  function withoutPassword(user) {
    if (!user || typeof user !== 'object') return user;
    // eslint-disable-next-line no-unused-vars
    const { password: pw, ...userWithoutPass } = user;
    return userWithoutPass;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // Normalize and validate TCKN: only digits, length 11
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
      // 1. ÖNCELİKLİ YOL: /api/auth/login endpoint'ine POST isteği dene
      console.log('Gönderilen (POST):', { tcKimlik, password });
      // backend expects `tckn` field (11 digits). Use normalized value.
      const payload = { tckn: normalizedTckn, password };
      console.log('Login payload:', payload);
      const response = await axios.post(`${BaseURL}/auth/login`, payload);

      console.log('Login başarılı (POST), response:', response.data);

      // Backend returns { status, message, data: { token, user } }
      const { token, user } = response.data?.data || response.data;

      if (!token) {
        throw new Error(t('login:error.no_token'));
      }

      // Use token and user directly
      await login({ token, user });
      navigate('/');

    } catch (err) {
      // 2. HATA YÖNETİMİ: axios hatası mı kontrol et
      if (axios.isAxiosError(err)) {
        // 2a. FALLBACK YOLU: Eğer 404 hatası alındıysa (endpoint yoksa), /users ile client-side doğrulamayı dene
        if (err.response && err.response.status === 404) {
          console.warn('/api/auth/login 404 verdi. Fallback: /api/v1/patients üzerinden client-side doğrulama deneniyor...');
          try {
            const usersResponse = await axios.get(`${BaseURL}/patients`);
            const users = usersResponse.data && usersResponse.data.users ? usersResponse.data.users : usersResponse.data;

            // Fallback: match backend field `tckn` or older `tcKimlik`
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
          // 2b. DİĞER API HATALARI: 401 (yetkisiz), 400 (hatalı istek) vb.
          console.error('API Hatası:', err.response.status, err.response.data);
          // If validation errors array exists, show first message
          const respData = err.response.data;
          if (respData && respData.errors && Array.isArray(respData.errors) && respData.errors.length) {
            setError(respData.errors.map(e => e.message).join('; '));
          } else {
            setError(respData?.message || t('common:server_error_with_status', { status: err.response.status }));
          }
        } else if (err.request) {
          // 2c. NETWORK HATASI: Sunucuya ulaşılamadı
          console.error('Network Hatası:', err.request);
          setError(t('login:error.network'));
        } else {
          // 2d. BEKLENMEDİK HATA
          console.error('Beklenmedik Hata:', err.message);
          setError(t('login:error.unexpected'));
        }
      } else {
        // axios dışı bir hata
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

              maxLength={11} // 11 karakter sınırı (HTML tarafı)
              onChange={(e) => {
                // Sadece rakamları kabul et ve 11 haneyi geçirme (State tarafı)
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

        <div className="login-footer-links">
          <div className="login-footer-link">
            <Link to="/forgot-password" className="login-link" style={{ fontSize: '14px', color: '#0d6efd' }}>
              {t('login:forgot_password')}
            </Link>
          </div>
          <div className="login-footer-link">
            {t('login:no_account')} <Link to="/register" className="login-link">{t('common:register')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}