import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function ForgotPasswordPage() {
  const { t } = useTranslation(['auth']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess(false);

    if (!email || !email.includes('@')) {
      setError(t('auth:forgot_password.errors.invalid_email'));
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
        setError(err.response.data?.message || t('auth:forgot_password.errors.request_failed'));
      } else if (err.request) {
        setError(t('auth:forgot_password.errors.network'));
      } else {
        setError(t('auth:forgot_password.errors.generic'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '440px' }}>
        <h2 className="login-title">{t('auth:forgot_password.title')}</h2>

        {success ? (
          <div className="success-message">
            <p>
              {t('auth:forgot_password.success_message')}
            </p>
            <div className="login-footer-link" style={{ marginTop: '24px' }}>
              <Link to="/login" className="login-link">{t('auth:forgot_password.back_to_login')}</Link>
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
              {t('auth:forgot_password.description')}
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="error-message" role="alert">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">{t('auth:forgot_password.email_label')}</label>
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
                {loading ? t('auth:forgot_password.loading') : t('auth:forgot_password.submit')}
              </button>
            </form>

            <div className="login-footer-link">
              {t('auth:forgot_password.remembered')} <Link to="/login" className="login-link">{t('common:buttons.login')}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
