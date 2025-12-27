import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { SPECIALTY_TRANSLATION_KEYS } from "../../constants/medicalSpecialties";
import "./Doctors.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

// Use new enum-based mapping
const DEPARTMENT_KEYS = SPECIALTY_TRANSLATION_KEYS;

export default function Doctors() {
  const { t } = useTranslation(['medical']);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const navigate = useNavigate();
  const { user: patientUser } = useAuth(); // Hasta kullanıcısını çek

  useEffect(() => {
    setLoading(true);
    // API'den doktorları çek
    fetch(`${API_BASE}/api/v1/doctors`)
      .then(res => {
        if (!res.ok) throw new Error(t('medical:doctors.loading_error'));
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
  }, [t]);

  // Doktor detay sayfasına git
  const handleViewDetails = (doc) => {
    navigate(`/doktor/${doc.id}`);
  };

  return (
    <section className="doctors-section" id="hekimlerimiz">
      <div className="doctors-header">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', textAlign: 'left' }}>
          <h2>{t('medical:doctors.title')}</h2>
        </div>
      </div>

      {/* BÖLÜMLERİ GÖRE FİLTER */}
      <div className="doctors-filter-container">
        <label className="filter-label">{t('medical:doctors.filter_label')}</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="department-select"
        >
          <option value="">{t('medical:doctors.all_departments')}</option>
          {Object.keys(DEPARTMENT_KEYS).map(dept => (
            <option key={dept} value={dept}>
              {t(`medical:departments.list.${DEPARTMENT_KEYS[dept]}.title`)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>{t('medical:doctors.loading')}</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: 32 }}>{error}</div>
      ) : (
        <div className="doctors-container">
          {doctors
            .filter(doc => !selectedDepartment || doc.specialization === selectedDepartment)
            .map((doc, i) => (
              <div
                className="doctor-card"
                key={doc.id || i}
              >
                {doc.photoUrl || doc.img ? (
                  <img
                    src={(doc.photoUrl || doc.img).startsWith('http') ? (doc.photoUrl || doc.img) : `${API_BASE}${doc.photoUrl || doc.img}`}
                    alt={doc.firstName + ' ' + doc.lastName}
                    className="doctor-photo"
                  />
                ) : (
                  <div className="doctor-photo-placeholder">
                    {`${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`.toUpperCase()}
                  </div>
                )}
                <h3>{doc.firstName} {doc.lastName}</h3>
                <p>
                  {DEPARTMENT_KEYS[doc.specialization]
                    ? t(`medical:departments.list.${DEPARTMENT_KEYS[doc.specialization]}.title`)
                    : (doc.specialization || doc.role || '')}
                </p>

                <button
                  className="appointment-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(doc);
                  }}
                >
                  {t('medical:doctors.view_details')}
                </button>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}