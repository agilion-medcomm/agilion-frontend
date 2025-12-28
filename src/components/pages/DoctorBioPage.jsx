import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SPECIALTY_TRANSLATION_KEYS } from '../../constants/medicalSpecialties';
import './DoctorBioPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

// Use new enum-based mapping
const DEPARTMENT_KEYS = SPECIALTY_TRANSLATION_KEYS;

export default function DoctorBioPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['medical']);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Tek doktor bilgisini API'den çek
    fetch(`${API_BASE}/api/v1/doctors`)
      .then(res => {
        if (!res.ok) throw new Error('Doktor bilgileri alınamadı');
        return res.json();
      })
      .then(data => {
        const foundDoctor = (data.data || []).find(d => d.id === parseInt(id));
        if (foundDoctor) {
          setDoctor(foundDoctor);
        } else {
          setError('Doktor bulunamadı');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleMakeAppointment = () => {
    if (!user) {
      alert(t('medical:doctors.login_required'));
      navigate('/login');
      return;
    }
    navigate('/randevu', { state: { doctor } });
  };

  if (loading) {
    return (
      <div className="bio-page-container" style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#f3f4f6' : '#333' }}>
          <h3>{t('medical:doctors.loading')}</h3>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="bio-page-container" style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ color: '#c1272d', marginBottom: 20 }}>{error || 'Doktor bulunamadı'}</h3>
          <button
            onClick={() => navigate('/hekimlerimiz')}
            style={{
              padding: '12px 24px',
              background: '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {t('medical:doctors.back_to_list')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bio-page-container" style={{ backgroundColor: isDark ? '#111827' : '#f9fafb' }}>
      <div className="bio-content-wrapper">
        {/* Geri Dön Butonu */}
        <button onClick={() => navigate('/hekimlerimiz')} className="bio-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t('medical:doctors.back_to_list')}
        </button>

        {/* Doktor Header */}
        <div className="bio-header" style={{
          backgroundColor: isDark ? '#1f2937' : '#fff',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        }}>
          <div className="bio-header-content">
            {/* Fotoğraf */}
            <div className="bio-photo-container">
              {doctor.img || doctor.photoUrl ? (
                <img
                  src={(doctor.img || doctor.photoUrl).startsWith('http')
                    ? (doctor.img || doctor.photoUrl)
                    : `${API_BASE}${doctor.img || doctor.photoUrl}`}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  className="bio-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="bio-photo-placeholder"
                style={{
                  display: (doctor.img || doctor.photoUrl) ? 'none' : 'flex',
                  backgroundColor: isDark ? '#374151' : '#f0f8ff',
                  color: isDark ? '#94a3b8' : '#1a4d5f'
                }}
              >
                {`${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase()}
              </div>
            </div>

            {/* Bilgiler */}
            <div className="bio-header-info">
              <h1 style={{ color: isDark ? '#f3f4f6' : '#0e2b4b' }}>
                {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="bio-specialization" style={{ color: isDark ? '#60a5fa' : '#5a9fb8' }}>
                {DEPARTMENT_KEYS[doctor.specialization]
                  ? t(`medical:departments.list.${DEPARTMENT_KEYS[doctor.specialization]}.title`)
                  : (doctor.specialization || doctor.role)}
              </p>
              {doctor.averageRating > 0 && (
                <div className="bio-rating">
                  <span style={{ color: '#fbbf24' }}>★</span>
                  <span style={{ color: isDark ? '#e5e7eb' : '#666' }}>
                    {doctor.averageRating.toFixed(1)} ({doctor.totalRatings} değerlendirme)
                  </span>
                </div>
              )}

              {/* Randevu Al Butonu */}
              <button onClick={handleMakeAppointment} className="bio-appointment-btn">
                {t('medical:doctors.make_appointment')}
              </button>
            </div>
          </div>
        </div>

        {/* DOKTOR BİLGİ ALANI - Modern Tasarım */}
        <div className="doctor-extra-info-section">
          <div className="doctor-info-card" style={{
            backgroundColor: isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)'
          }}>
            <div className="info-card-header" style={{
              backgroundColor: isDark ? '#0f3688' : '#f1f5f9',
              borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }}>
              <img src="/info-circle.svg" alt="Info" className="info-icon" />
              <h3 style={{ color: isDark ? '#f1f5f9' : '#2563eb' }}>
                Doktor Hakkında
              </h3>
            </div>
            <div className="info-card-body">
              {/* Biyografi */}
              {doctor.biography && (
                <div className="bio-section">
                  <h4 style={{ color: isDark ? '#60a5fa' : '#1843a1' }}>
                    {t('medical:doctors.biography')}
                  </h4>
                  <p style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    {doctor.biography}
                  </p>
                </div>
              )}

              {/* Uzmanlık ve Eğitim Grid */}
              {(doctor.expertiseAreas || doctor.educationAndAchievements) && (
                <div className="expertise-grid" style={{
                  borderBottomColor: isDark ? '#334155' : '#f1f5f9'
                }}>
                  {doctor.expertiseAreas && (
                    <div className="expertise-item">
                      <h4 style={{ color: isDark ? '#60a5fa' : '#1843a1' }}>
                        {t('medical:doctors.expertise_areas')}
                      </h4>
                      <ul>
                        {doctor.expertiseAreas.split('\n').filter(line => line.trim()).map((item, idx) => (
                          <li key={idx} style={{ color: isDark ? '#94a3b8' : '#475569' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {doctor.educationAndAchievements && (
                    <div className="expertise-item">
                      <h4 style={{ color: isDark ? '#60a5fa' : '#1843a1' }}>
                        {t('medical:doctors.education_achievements')}
                      </h4>
                      <ul>
                        {doctor.educationAndAchievements.split('\n').filter(line => line.trim()).map((item, idx) => (
                          <li key={idx} style={{ color: isDark ? '#94a3b8' : '#475569' }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Çalışma Prensipleri */}
              {doctor.workPrinciples && (
                <div className="principles-section">
                  <h4 style={{ color: isDark ? '#60a5fa' : '#1843a1' }}>
                    {t('medical:doctors.work_principles')}
                  </h4>
                  <p style={{ color: isDark ? '#94a3b8' : '#475569' }}>
                    {doctor.workPrinciples}
                  </p>
                </div>
              )}

              {/* Eğer hiçbir detay yoksa */}
              {!doctor.biography && !doctor.expertiseAreas && !doctor.educationAndAchievements && !doctor.workPrinciples && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: isDark ? '#9ca3af' : '#666', fontSize: '1.05rem' }}>
                    {t('medical:doctors.no_bio_info')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
