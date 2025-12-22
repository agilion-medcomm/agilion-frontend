import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './EvdeSaglikPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';


// Statik veriler artık t() ile bileşen içinde useMemo ile oluşturulacak

export default function EvdeSaglikPage() {
  const { t } = useTranslation(['medical']);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    tckn: '',
    phoneNumber: '',
    email: '',
    address: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const serviceCards = useMemo(() => [
    {
      icon: <img src="/nurse1.svg" alt="Nurse" className="custom-svg-icon" />,
      title: t('medical:home_health.cards.nurse.title'),
      backendTitle: "Evde Hemşirelik Hizmetleri",
      description: t('medical:home_health.cards.nurse.desc'),
      services: t('medical:home_health.cards.nurse.items', { returnObjects: true })
    },
    {
      icon: <img src="/serum2.svg" alt="Serum" className="custom-svg-icon" />,
      title: t('medical:home_health.cards.serum.title'),
      backendTitle: "Evde Serum Hizmetleri",
      description: t('medical:home_health.cards.serum.desc'),
      services: t('medical:home_health.cards.serum.items', { returnObjects: true })
    },
    {
      icon: <img src="/lab3.svg" alt="Laboratory" className="custom-svg-icon" />,
      title: t('medical:home_health.cards.lab.title'),
      backendTitle: "Evde Laboratuvar Hizmetleri",
      description: t('medical:home_health.cards.lab.desc'),
      services: t('medical:home_health.cards.lab.items', { returnObjects: true })
    },
    {
      icon: <img src="/care4.svg" alt="Wound Care" className="custom-svg-icon" />,
      title: t('medical:home_health.cards.wound.title'),
      backendTitle: "Evde Yara Bakımı Hizmetleri",
      description: t('medical:home_health.cards.wound.desc'),
      services: t('medical:home_health.cards.wound.items', { returnObjects: true })
    }
  ], [t]);

  const includedServices = useMemo(() => t('medical:home_health.covers.list', { returnObjects: true }), [t]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const openRequestForm = (serviceTitle) => {
    if (!user) {
      setShowLoginPrompt(true);
      setSelectedService(null);
      return;
    }

    setFormData(prev => ({
      ...prev,
      serviceType: serviceTitle,
      fullName: user.firstName + ' ' + user.lastName,
      tckn: user.tckn || '',
      phoneNumber: user.phoneNumber || user.phone || '',
      email: user.email || ''
    }));
    setSelectedService(null);
    setShowRequestForm(true);
    setSubmitResult(null);
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setFormData({
      fullName: '',
      tckn: '',
      phoneNumber: '',
      email: '',
      address: '',
      serviceType: '',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
    setSubmitResult(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch(`${API_BASE}/home-health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: t('medical:home_health.form.success_msg') });
        setFormData({
          fullName: '',
          tckn: '',
          phoneNumber: '',
          email: '',
          address: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
      } else {
        setSubmitResult({ success: false, message: data.message || t('medical:home_health.form.error_msg') });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitResult({ success: false, message: t('medical:home_health.form.network_error') });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="evde-saglik-page">
      {/* Üst Banner */}
      <div className="page-banner">
        <img src="/esp-banner.png" alt="Banner" className="page-banner-img" />
        <div className="page-banner-overlay">
          <h1 className="page-banner-title">{t('medical:home_health.banner_title')}</h1>
        </div>
      </div>

      {/* Hizmet Kartları Bölümü */}
      <div className="page-section bg-light">
        <div className="container">
          <div className="service-card-grid">
            {serviceCards.map((card, index) => (
              <div className="service-card" key={index}>
                <div className="service-card-icon">{card.icon}</div>
                <h3 className="service-card-title">{card.title}</h3>
                <p className="service-card-desc">{card.description}</p>
                <button
                  className="service-card-button"
                  onClick={() => handleServiceClick(card)}
                >
                  {t('medical:common.examine')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İçerik Bölümleri */}
      <div className="page-section">
        <div className="container content-container">
          {/* Evde Sağlık Nedir */}
          <section className="content-section">
            <h2>{t('medical:home_health.what_is.title')}</h2>
            <img src="/evde-saglik-1.jpg" alt="Home Health" className="content-image" />
            <p>{t('medical:home_health.what_is.p1')}</p>
            <p>{t('medical:home_health.what_is.p2')}</p>
          </section>

          {/* Evde Sağlık Hizmeti Neleri Kapsar */}
          <section className="content-section">
            <h2>{t('medical:home_health.covers.title')}</h2>
            <img src="/evde-saglik-2.jpg" alt="Home Health Scope" className="content-image" />
            <p>{t('medical:home_health.covers.text')}</p>
            <div className="pills-grid">
              {includedServices.map((service, index) => (
                <div className="pill" key={index}>{service}</div>
              ))}
            </div>
          </section>

          {/* Evde Doktor Hizmeti */}
          <section className="content-section">
            <h2>{t('medical:home_health.doctor_service.title')}</h2>
            <img src="/evde-saglik-3.jpg" alt="Doctor Home Visit" className="content-image" />
            <p>{t('medical:home_health.doctor_service.p1')}</p>
            <p>{t('medical:home_health.doctor_service.p2')}</p>
          </section>
        </div>
      </div>

      {/* Hizmet Detay Modalı */}
      {selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            <div className="modal-header">
              <div className="modal-icon">{selectedService.icon}</div>
              <h2>{selectedService.title}</h2>
              <button className="modal-close" onClick={closeModal}>
                <img src="/x.svg" alt="Close" />
              </button>            </div>

            <div className="modal-body">
              {/* İçeriği yan yana almak için yeni bir kapsayıcı açtık */}
              <div className="modal-row">

                {/* SOL Taraf: Açıklama */}
                <div className="modal-col-left">
                  <h3 className="modal-subtitle">{t('medical:home_health.modal.service_detail')}</h3>
                  <p className="modal-description">{selectedService.description}</p>
                </div>

                {/* SAĞ Taraf: Liste */}
                <div className="modal-col-right">
                  <h3 className="modal-subtitle">{t('medical:home_health.modal.offered_services')}</h3>
                  <ul className="service-list">
                    {selectedService.services.map((service, index) => (
                      <li key={index}>
                        <span className="checkmark">✓</span> {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alt Kısım: Sadece Randevu Butonu */}
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => openRequestForm(selectedService.backendTitle)}>
                  {t('medical:home_health.modal.book_btn')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Randevu Talep Formu Modalı */}
      {showRequestForm && (
        <div className="modal-overlay" onClick={closeRequestForm}>
          <div className="modal-content request-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('medical:home_health.form.title')}</h2>
              <button className="modal-close" onClick={closeRequestForm}>
                <img src="/x.svg" alt="Close" />
              </button>
            </div>

            <div className="modal-body">
              {submitResult && (
                <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
                  {submitResult.message}
                </div>
              )}

              {!submitResult?.success && (
                <form onSubmit={handleSubmit} className="request-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">{t('medical:home_health.form.full_name')}</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder={t('medical:home_health.form.name_placeholder')}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tckn">{t('medical:home_health.form.tckn')}</label>
                      <input
                        type="text"
                        id="tckn"
                        name="tckn"
                        value={formData.tckn}
                        onChange={handleInputChange}
                        required
                        placeholder={t('medical:home_health.form.tckn_placeholder')}
                        maxLength={11}
                        pattern="[0-9]{11}"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">{t('medical:home_health.form.phone')}</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">{t('medical:auth.labels.email')}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">{t('medical:home_health.form.address')}</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder={t('medical:home_health.form.address_placeholder')}
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="serviceType">{t('medical:home_health.form.service_type')}</label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">{t('medical:home_health.form.select_service')}</option>
                      {serviceCards.map((card, index) => (
                        <option key={index} value={card.backendTitle}>{card.title}</option>
                      ))}
                      <option value="Evde Doktor Hizmeti">{t('medical:home_health.form.doctor_svc')}</option>
                      <option value="Diğer">{t('medical:home_health.form.other')}</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredDate">{t('medical:home_health.form.preferred_date')}</label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="preferredTime">{t('medical:home_health.form.preferred_time')}</label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                      >
                        <option value="">{t('medical:home_health.form.select_time')}</option>
                        <option value="09:00-12:00">09:00 - 12:00</option>
                        <option value="12:00-15:00">12:00 - 15:00</option>
                        <option value="15:00-18:00">15:00 - 18:00</option>
                        <option value="18:00-21:00">18:00 - 21:00</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="notes">{t('medical:home_health.form.notes')}</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder={t('medical:home_health.form.notes_placeholder')}
                      rows={3}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={closeRequestForm}>
                      {t('medical:home_health.form.cancel')}
                    </button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? t('medical:home_health.form.sending') : t('medical:home_health.form.submit')}
                    </button>
                  </div>
                </form>
              )}

              {submitResult?.success && (
                <div className="form-actions">
                  <button className="btn-primary" onClick={closeRequestForm}>
                    {t('medical:home_health.form.ok')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Giriş Uyarı Modalı */}
      {showLoginPrompt && (
        <div className="modal-overlay" onClick={closeLoginPrompt}>
          <div className="modal-content login-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('medical:home_health.login_prompt.title')}</h2>
              <button className="modal-close" onClick={closeLoginPrompt}>
                <img src="/x.svg" alt="Close" />
              </button>
            </div>
            <div className="modal-body">
              <div className="login-prompt-content">
                <div className="login-prompt-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                  </svg>
                </div>
                <p className="login-prompt-message">{t('medical:home_health.login_prompt.msg')}</p>
                <p className="login-prompt-submessage">{t('medical:home_health.login_prompt.submsg')}</p>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeLoginPrompt}>
                  {t('medical:home_health.form.cancel')}
                </button>
                <button type="button" className="btn-primary" onClick={goToLogin}>
                  {t('medical:home_health.login_prompt.login_btn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}