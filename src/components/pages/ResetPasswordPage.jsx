import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Geçersiz şifre sıfırlama bağlantısı. Token bulunamadı.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!token) {
      setError('Geçersiz token.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BaseURL}/auth/reset-password`, {
        token,
        newPassword,
      });

      if (response.data?.status === 'success') {
        setSuccess(true);
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Şifre sıfırlama başarısız oldu.');
      } else if (err.request) {
        setError('Sunucuya ulaşılamıyor. Lütfen daha sonra tekrar deneyin.');
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token && !error) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Yükleniyor...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">Yeni Şifre Oluştur</h2>
        
        {success ? (
          <div className="success-message">
            <p>
              Şifreniz başarıyla değiştirildi! Giriş sayfasına yönlendiriliyorsunuz...
            </p>
            <div className="login-footer-link" style={{ marginTop: '24px' }}>
              <Link to="/login" className="login-link">Hemen giriş yap</Link>
            </div>
          </div>
        ) : (
          <>
            <p style={{ 
              textAlign: 'center', 
              color: '#6b7280', 
              marginBottom: '24px',
              fontSize: '15px'
            }}>
              Lütfen yeni şifrenizi girin.
            </p>
            
            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="error-message" role="alert">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="newPassword">Yeni Şifre</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  minLength={8}
                  placeholder="En az 8 karakter"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  minLength={8}
                  placeholder="Şifrenizi tekrar girin"
                  required
                />
              </div>
              
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Şifre Değiştiriliyor...' : 'Şifremi Değiştir'}
              </button>
            </form>
            
            <div className="login-footer-link">
              <Link to="/login" className="login-link">Giriş sayfasına dön</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
