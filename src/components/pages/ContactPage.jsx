import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './ContactPage.css'; // Stil dosyamızı import ediyoruz

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;


const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const LocationIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;

export default function ContactPage() {
  const { user } = useAuth();
  const { t } = useTranslation(['contact']);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    agreed: false
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  // Giriş yapmış kullanıcının bilgilerini otomatik doldur
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phoneNumber || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage({ type: '', text: '' });

    if (!formData.agreed) {
      setSubmitMessage({ type: 'error', text: t('contact:messages.agreement_error') });
      return;
    }

    setLoading(true);
    try {
      const { agreed, ...payload } = formData; // agreed alanını çıkar
      await axios.post(`${BaseURL}/contact`, payload);

      setSubmitMessage({ type: 'success', text: t('contact:messages.success') });
      // Form başarılı gönderildikten sonra sadece konu ve mesajı temizle (kullanıcı bilgileri kalsın)
      setFormData(prev => ({ ...prev, subject: '', message: '', agreed: false }));
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: error.response?.data?.message || t('contact:messages.generic_error')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Üst Banner */}
      <div className="contact-banner">
        <img src="/contact-banner.png" alt="İletişim Merkezi" className="contact-banner-img" />
        <div className="contact-banner-overlay">
          <h1></h1>
        </div>
      </div>

      <div className="container page-section">
        {/* Başlık ve Açıklama */}
        <div className="contact-header">
          <h1 className="contact-title">{t('contact:header.title')}</h1>
          <p className="contact-subtitle">
            {t('contact:header.subtitle')}
          </p>
        </div>

        {/* İletişim Bilgileri */}
        <div className="contact-info-grid">
          <div className="contact-info-item">
            <PhoneIcon />
            <span>+90 (212) 665 70 10</span>
          </div>
          <div className="contact-info-item">
            <MailIcon />
            <span>info@zeytinburnutipmerkezi.com.tr</span>
          </div>
          <div className="contact-info-item">
            <PhoneIcon />
            <span>+90 (212) 558 40 52</span>
          </div>
          <div className="contact-info-item">
            <LocationIcon />
            <span>Yenidoğan Mah. 50 Sok. No :22 Zeytinburnu/İstanbul</span>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="contact-form-container">
          {submitMessage.text && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '8px',
              backgroundColor: submitMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: submitMessage.type === 'error' ? '#991b1b' : '#166534',
              border: `1px solid ${submitMessage.type === 'error' ? '#f87171' : '#86efac'}`,
              fontWeight: '500'
            }}>
              {submitMessage.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder={t('contact:form.placeholders.name')} value={formData.name} onChange={handleChange} required />
              <input 
                type="tel" 
                name="phone" 
                placeholder={t('contact:form.placeholders.phone')} 
                value={formData.phone} 
                onChange={handleChange}
                pattern="[+]?[0-9]{10,15}"
                maxLength={10}
                minLength={10}
                title="Telefon numarası 10-15 haneli olmalıdır."
                required 
              />
            </div>
            <div className="form-row">
              <input type="email" name="email" placeholder={t('contact:form.placeholders.email')} value={formData.email} onChange={handleChange} required />
              <input type="text" name="subject" placeholder={t('contact:form.placeholders.subject')} value={formData.subject} onChange={handleChange} required />
            </div>
            <textarea name="message" placeholder={t('contact:form.placeholders.message')} rows="6" value={formData.message} onChange={handleChange} required></textarea>
            <div className="form-agreement">
              <input type="checkbox" id="agreed" name="agreed" checked={formData.agreed} onChange={handleChange} />
              <label htmlFor="agreed">
                {t('contact:form.agreement')}
              </label>
            </div>
            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? t('contact:form.loading') : t('contact:form.submit')}
            </button>
          </form>
        </div>
        {/* Harita */}
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.6660938785153!2d28.904464800000003!3d40.988791899999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb1301a54129%3A0xb66ed631d8ac1b91!2sZeytinburnu%20Cerrahi%20T%C4%B1p%20Merkezi!5e0!3m2!1str!2str!4v1764944304698!5m2!1str!2str"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t('contact:map_title')}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
