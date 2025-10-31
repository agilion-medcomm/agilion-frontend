import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; // axios import edildi
import './LoginPage.css';

const BaseURL = 'http://localhost:3000';

export default function LoginPage() {
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

    if (!tcKimlik || !password) {
      setError('TC No ve şifre gerekli.');
      return;
    }

    setLoading(true);

    try {
      // 1. ÖNCELİKLİ YOL: /api/auth/login endpoint'ine POST isteği dene
      console.log('Gönderilen (POST):', { tcKimlik, password });
      const response = await axios.post(`${BaseURL}/api/auth/login`, { tcKimlik, password });

      console.log('Login başarılı (POST), response:', response.data);

      // Sunucudan dönen { token, user } verisini işle
      const { token, user } = response.data;
      if (!token || !user) {
        throw new Error('Sunucudan beklenen token/user verisi gelmedi.');
      }
      
      login({ token, user: withoutPassword(user) });
      navigate('/');

    } catch (err) {
      // 2. HATA YÖNETİMİ: axios hatası mı kontrol et
      if (axios.isAxiosError(err)) {
        // 2a. FALLBACK YOLU: Eğer 404 hatası alındıysa (endpoint yoksa), /users ile client-side doğrulamayı dene
        if (err.response && err.response.status === 404) {
          console.warn('/api/auth/login 404 verdi. Fallback: /users üzerinden client-side doğrulama deneniyor...');
          try {
            const usersResponse = await axios.get(`${BaseURL}/users`);
            const users = usersResponse.data;

            // Farklı olası alan adlarını kontrol et (tcKimlik, identy_number, vb.)
            const user = users.find(u =>
                (u.tcKimlik === tcKimlik || u.identy_number === tcKimlik) && u.password === password
            );

            if (user) {
              console.log('Fallback login başarılı (mock token). user:', user);
              const mockToken = `mock-token-${user.id}-${Date.now()}`;
              login({ token: mockToken, user: withoutPassword(user) });
              navigate('/');
            } else {
              setError('TC veya şifre yanlış.');
            }
          } catch (fallbackErr) {
            console.error('Fallback GET /users hatası:', fallbackErr);
            setError('Kullanıcı listesi alınamadı veya bir hata oluştu.');
          }
        } else if (err.response) {
          // 2b. DİĞER API HATALARI: 401 (yetkisiz), 400 (hatalı istek) vb.
          console.error('API Hatası:', err.response.status, err.response.data);
          setError(err.response.data?.message || `Sunucu hatası: ${err.response.status}`);
        } else if (err.request) {
          // 2c. NETWORK HATASI: Sunucuya ulaşılamadı
          console.error('Network Hatası:', err.request);
          setError('Sunucuya ulaşılamıyor. Lütfen ağ bağlantınızı ve sunucunun çalıştığını kontrol edin.');
        } else {
          // 2d. BEKLENMEDİK HATA
          console.error('Beklenmedik Hata:', err.message);
          setError('Beklenmedik bir hata oluştu.');
        }
      } else {
        // axios dışı bir hata
        console.error('Genel Hata:', err);
        setError(err.message || 'Bilinmeyen bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">Giriş Yap</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" role="alert">{error}</div>}
          <div className="form-group">
            <label htmlFor="tcKimlik">Kullanıcı Adı (TC No)</label>
            <input
              type="text"
              id="tcKimlik"
              className="form-input"
              placeholder="TC No girin"
              value={tcKimlik}
              onChange={(e) => setTcKimlik(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Şifre girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
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