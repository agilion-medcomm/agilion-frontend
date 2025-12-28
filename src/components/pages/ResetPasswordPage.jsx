import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function ResetPasswordPage() {
  const { t } = useTranslation(['auth']);
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
      setError(t('auth:reset_password.errors.token_missing'));
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, t]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!token) {
      setError(t('auth:reset_password.errors.token_missing'));
      return;
    }

    if (newPassword.length < 8) {
      setError(t('auth:reset_password.errors.password_min'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth:reset_password.errors.password_mismatch'));
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

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || t('auth:reset_password.errors.failed'));
      } else if (err.request) {
        setError(t('auth:reset_password.errors.network'));
      } else {
        setError(t('auth:reset_password.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  }

  if (!token && !error) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">{t('common:loading')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">{t('auth:reset_password.title')}</h2>

        {success ? (
          <div className="success-message">
            <p>
              {t('auth:reset_password.success_message')}
            </p>
            <div className="login-footer-link" style={{ marginTop: '24px' }}>
              <Link to="/login" className="login-link">{t('auth:reset_password.go_to_login')}</Link>
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
              {t('auth:reset_password.description')}
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="error-message" role="alert">{error}</div>}

              <div className="form-group">
                <label htmlFor="newPassword">{t('auth:reset_password.new_password_label')}</label>
                <input
                  type="password"
                  id="newPassword"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  minLength={8}
                  placeholder={t('auth:register.form.password_placeholder')}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('auth:reset_password.confirm_password_label')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  minLength={8}
                  placeholder={t('auth:register.form.confirm_password_placeholder')}
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? t('auth:reset_password.loading') : t('auth:reset_password.submit')}
              </button>
            </form>

            <div className="login-footer-link">
              <Link to="/login" className="login-link">{t('auth:reset_password.back_to_login')}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
