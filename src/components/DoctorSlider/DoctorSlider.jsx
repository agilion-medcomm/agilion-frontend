// src/components/DoctorSlider/DoctorSlider.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { SPECIALTY_TRANSLATION_KEYS } from "../../constants/medicalSpecialties";
import "./DoctorSlider.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const ITEMS_PER_PAGE = 4; // Her sayfada maksimum 4 doktor

// Use new enum-based mapping
const DEPARTMENT_KEYS = SPECIALTY_TRANSLATION_KEYS;

export default function DoctorSlider() {
  const { t } = useTranslation(['home', 'medical']);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SLIDER STATE
  const [currentPage, setCurrentPage] = useState(0);

  const navigate = useNavigate();
  const { user: patientUser } = useAuth();

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE}/api/v1/doctors`)
      .then(res => {
        if (!res.ok) throw new Error('Sunucu hatası');
        return res.json();
      })
      .then(data => {
        setDoctors(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAppointmentClick = (doctorData) => {
    // 1. Giriş kontrolü
    if (!patientUser) {
      alert(t('home:doctor_slider.alert_login'));
      navigate('/login');
      return;
    }

    // 2. Doğrudan Randevu Sayfasına yönlendir (Doktor verisiyle)
    navigate('/randevu', { state: { doctor: doctorData } });
  };

  // Hesaplamalar
  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const visibleDoctors = doctors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Navigasyon İşlevleri
  const handleNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="doctor-slider-section">
      <div className="container">
        <div className="doctor-slider-header">
          <h2>{t('home:doctor_slider.title')}</h2>
        </div>

        {loading ? (
          <div className="slider-loading">{t('home:doctor_slider.loading')}</div>
        ) : error ? (
          <div className="slider-error">{t('home:doctor_slider.error', { error })}</div>
        ) : (
          <div className="doctor-slider-wrapper">
            <div className="doctor-slider-container">
              {visibleDoctors.map((doc, i) => (
                <div className="slider-doctor-card" key={doc.id || i}>
                  {doc.img ? (
                    <img
                      src={doc.img.startsWith('http') ? doc.img : `${API_BASE}${doc.img}`}
                      alt={doc.firstName + ' ' + doc.lastName}
                      className="slider-doctor-img"
                    />
                  ) : (
                    <div className="slider-doctor-initials">
                      {`${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`.toUpperCase()}
                    </div>
                  )}
                  <h3 className="slider-doctor-name">{doc.firstName} {doc.lastName}</h3>
                  <p className="slider-doctor-specialization">
                    {DEPARTMENT_KEYS[doc.specialization]
                      ? t(`medical:departments.list.${DEPARTMENT_KEYS[doc.specialization]}.title`)
                      : (doc.specialization || doc.role || '')}
                  </p>

                  {doc.averageRating ? (
                    <div className="slider-doctor-rating">
                      <span className="rating-stars">⭐ {doc.averageRating.toFixed(1)}/5</span>
                      <span className="rating-count">{t('home:doctor_slider.rating_count', { count: doc.totalRatings || 0 })}</span>
                    </div>
                  ) : (
                    <div className="slider-doctor-rating">
                      <span className="no-rating">{t('home:doctor_slider.no_rating')}</span>
                    </div>
                  )}

                  <button
                    className="slider-appointment-button"
                    onClick={() => handleAppointmentClick(doc)}
                  >
                    {t('home:doctor_slider.book')}
                  </button>
                </div>
              ))}
            </div>

            {/* Navigasyon ve Sayfalama (Alt Bölüm) */}
            {totalPages > 1 && (
              <div className="slider-controls-bottom">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="slider-nav-btn prev"
                >
                  <img src="/angle-left.svg" alt={t('home:doctor_slider.back')} />
                </button>

                <div className="slider-dots-pagination">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`slider-dot ${currentPage === idx ? 'active' : ''}`}
                      onClick={() => setCurrentPage(idx)}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="slider-nav-btn next"
                >
                  <img src="/angle-right.svg" alt={t('home:doctor_slider.next')} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}