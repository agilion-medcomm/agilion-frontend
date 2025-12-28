import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Geçersiz doğrulama bağlantısı.');
      return;
    }

    axios.post(`${API_BASE}/api/v1/auth/verify-email`, { token })
      .then(res => {
        setStatus('success');
        setMessage('E-postanız başarıyla doğrulandı! Yönlendiriliyorsunuz...');

        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Doğrulama başarısız oldu.');
      });
  }, [searchParams, navigate]);

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '450px', textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <h2 className="login-title">Doğrulanıyor...</h2>
            <p>Lütfen bekleyin, hesabınız aktif ediliyor.</p>
          </>
        )}

        {status === 'success' && (
          <div className="success-message">
            <h2>✅ Başarılı!</h2>
            <p>{message}</p>
            <div style={{ marginTop: 20 }}>
                <Link to="/login" className="login-link">Hemen Giriş Yap</Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="error-message">
            <h2>❌ Hata</h2>
            <p>{message}</p>
            <div style={{ marginTop: 20 }}>
                <Link to="/register" className="login-link">Tekrar Kayıt Ol</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
