import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SPECIALTY_TRANSLATION_KEYS } from '../../constants/medicalSpecialties';
import './DoctorBioPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

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

        <button onClick={() => navigate('/hekimlerimiz')} className="bio-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          {t('medical:doctors.back_to_list')}
        </button>

        <div className="bio-header" style={{
          backgroundColor: isDark ? '#1f2937' : '#fff',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        }}>
          <div className="bio-header-content">

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

              <button onClick={handleMakeAppointment} className="bio-appointment-btn">
                {t('medical:doctors.make_appointment')}
              </button>
            </div>
          </div>
        </div>

        <div className="bio-sections">

          {doctor.biography && (
            <section className="bio-section" style={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }}>
              <h2 style={{ color: isDark ? '#f3f4f6' : '#0e2b4b' }}>
                {t('medical:doctors.biography')}
              </h2>
              <p style={{ color: isDark ? '#d1d5db' : '#4b5563', lineHeight: 1.8 }}>
                {doctor.biography}
              </p>
            </section>
          )}

          {doctor.expertiseAreas && (
            <section className="bio-section" style={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }}>
              <h2 style={{ color: isDark ? '#f3f4f6' : '#0e2b4b' }}>
                {t('medical:doctors.expertise_areas')}
              </h2>
              <ul className="bio-list">
                {doctor.expertiseAreas.split('\n').filter(Boolean).map((area, i) => (
                  <li key={i} style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                    <span style={{ color: '#10b981', marginRight: 8 }}>✓</span>
                    {area}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {doctor.educationAndAchievements && (
            <section className="bio-section" style={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }}>
              <h2 style={{ color: isDark ? '#f3f4f6' : '#0e2b4b' }}>
                {t('medical:doctors.education_achievements')}
              </h2>
              <ul className="bio-list">
                {doctor.educationAndAchievements.split('\n').filter(Boolean).map((edu, i) => (
                  <li key={i} style={{ color: isDark ? '#d1d5db' : '#4b5563' }}>
                    <span style={{ color: '#3b82f6', marginRight: 8 }}>🎓</span>
                    {edu}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {doctor.workPrinciples && (
            <section className="bio-section" style={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              borderColor: isDark ? '#374151' : '#e5e7eb'
            }}>
              <h2 style={{ color: isDark ? '#f3f4f6' : '#0e2b4b' }}>
                {t('medical:doctors.work_principles')}
              </h2>
              <p style={{ color: isDark ? '#d1d5db' : '#4b5563', lineHeight: 1.8 }}>
                {doctor.workPrinciples}
              </p>
            </section>
          )}

          {!doctor.biography && !doctor.expertiseAreas && !doctor.educationAndAchievements && !doctor.workPrinciples && (
            <div className="bio-section" style={{
              backgroundColor: isDark ? '#1f2937' : '#fff',
              borderColor: isDark ? '#374151' : '#e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ color: isDark ? '#9ca3af' : '#666' }}>
                {t('medical:doctors.no_bio_info')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
