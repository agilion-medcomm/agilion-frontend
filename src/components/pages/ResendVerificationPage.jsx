import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

export default function ResendVerificationPage() {
    const { t } = useTranslation(['auth', 'common']);
    const [tckn, setTckn] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = {
                tckn: tckn.replace(/\D/g, ''),
                email: newEmail || undefined // Only send if provided
            };

            const response = await axios.post(`${BaseURL}/auth/resend-verification`, payload);

            // Determine which success message to show based on action
            const successKey = payload.email
                ? 'auth:resend_verification.success_updated'
                : 'auth:resend_verification.success_resended';

            setMessage({
                type: 'success',
                text: t(successKey)
            });
            // Clear form on success
            setTckn('');
            setNewEmail('');

        } catch (err) {
            console.error('Resend verification error:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Operation failed.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-box" style={{ maxWidth: '450px' }}>
                <h2 className="login-title">{t('auth:resend_verification.title')}</h2>
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                    {t('auth:resend_verification.description')}
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                    {message.text && (
                        <div className={message.type === 'error' ? 'error-message' : 'success-message'} style={message.type === 'success' ? { color: 'green', backgroundColor: '#e6fffa', padding: '10px', borderRadius: '4px', marginBottom: '15px' } : {}}>
                            {message.text}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="tckn">{t('auth:resend_verification.tckn_label')}</label>
                        <input
                            type="text"
                            id="tckn"
                            className="form-input"
                            value={tckn}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 11) setTckn(val);
                            }}
                            required
                            maxLength={11}
                            minLength={11}
                            placeholder={t('auth:resend_verification.tckn_placeholder')}
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newEmail">{t('auth:resend_verification.new_email_label')}</label>
                        <input
                            type="email"
                            id="newEmail"
                            className="form-input"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder={t('auth:resend_verification.new_email_placeholder')}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? t('auth:resend_verification.loading') : t('auth:resend_verification.submit')}
                    </button>
                </form>

                <div className="login-footer-links">
                    <div className="login-footer-link">
                        <Link to="/login" className="login-link">{t('auth:resend_verification.back_to_login')}</Link>
                    </div>
                    <div className="login-footer-link">
                        <Link to="/register" className="login-link">{t('auth:resend_verification.back_to_register')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
