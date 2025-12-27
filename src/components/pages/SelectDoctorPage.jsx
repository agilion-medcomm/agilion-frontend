import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// API Adresini diğer sayfalardaki gibi tanımlıyoruz
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

// Mappings for translation keys
const DEPARTMENT_KEYS = {
  'Acil 7/24': 'acil',
  'Ağız ve Diş': 'dis',
  'Beslenme Diyet': 'diyet',
  'Dermatoloji': 'derma',
  'Genel Cerrahi': 'cerrahi',
  'Göz Sağlığı': 'goz',
  'İç Hastalıklar': 'dahiliye',
  'Kadın & Doğum': 'kadin',
  'Kardiyoloji': 'kardiyoloji',
  'Nöroloji': 'noroloji'
};

import { useTheme } from "../../context/ThemeContext";

const SelectDoctorPage = () => {
  const { t } = useTranslation(['medical']);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetch(`${BaseURL}/doctors`)
      .then((res) => {
        if (!res.ok) throw new Error("Doktor listesi sunucudan çekilemedi.");
        return res.json();
      })
      .then((data) => {
        setDoctors(data.data || (Array.isArray(data) ? data : []));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Doktor yükleme hatası:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSelect = (doctor) => {
    navigate("/randevu", { state: { doctor } });
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#111827' : 'transparent', color: isDark ? '#f3f4f6' : 'inherit' }}>
      <h3>{t('medical:doctors.loading')}</h3>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c1272d', backgroundColor: isDark ? '#111827' : 'transparent' }}>
      <h3>{t('common:error')}: {error}</h3>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isDark ? '#111827' : '#f9fafb',
      transition: 'background-color 0.3s ease',
      width: '100%'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "60px 20px"
      }}>
        <h2 style={{
          textAlign: "left",
          color: isDark ? "#f3f4f6" : "#0e2b4b",
          marginBottom: 10,
          fontSize: '2rem'
        }}>
          {t('medical:doctors.select_doctor_title')}
        </h2>
        <p style={{
          textAlign: "left",
          color: isDark ? "#9ca3af" : "#666",
          marginBottom: 30
        }}>
          {t('medical:doctors.select_doctor_subtitle')}
        </p>

        {/* BÖLÜMLERİ GÖRE FİLTRE */}
        <div style={{ maxWidth: 400, margin: '0 0 50px 0' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: isDark ? '#e5e7eb' : '#0e2b4b'
          }}>{t('medical:doctors.filter_label')}</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: isDark ? '1px solid #374151' : '1px solid #ddd',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: isDark ? '#1f2937' : '#fff',
              color: isDark ? '#f3f4f6' : '#334155'
            }}
          >
            <option value="">{t('medical:doctors.all_departments')}</option>
            {Object.keys(DEPARTMENT_KEYS).map(dept => (
              <option key={dept} value={dept}>
                {t(`medical:departments.list.${DEPARTMENT_KEYS[dept]}.title`)}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
          justifyItems: "center"
        }}>
          {doctors
            .filter(doc => !selectedDepartment || doc.specialization === selectedDepartment)
            .map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleSelect(doctor)}
                style={{
                  cursor: "pointer",
                  background: isDark ? "#1f2937" : "#fff",
                  borderRadius: 16,
                  padding: "24px 16px",
                  textAlign: "center",
                  boxShadow: isDark ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.05)",
                  border: isDark ? "1px solid #374151" : "1px solid #eff2f7",
                  transition: "transform 0.2s, box-shadow 0.2s, background-color 0.3s",
                  width: '100%',
                  maxWidth: '300px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDark ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)';
                }}
              >
                {/* Fotoğraf Alanı */}
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: isDark ? "#374151" : "#f0f8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                    overflow: "hidden",
                    border: isDark ? "4px solid #4b5563" : "4px solid #0d6efd",
                    fontSize: 40,
                    fontWeight: 700,
                    color: isDark ? "#94a3b8" : "#1a4d5f",
                    position: 'relative'
                  }}
                >
                  {doctor.photoUrl || doctor.img ? (
                    <img
                      src={(doctor.photoUrl || doctor.img).startsWith('http') ? (doctor.photoUrl || doctor.img) : `${API_BASE}${doctor.photoUrl || doctor.img}`}
                      alt={`${doctor.firstName} ${doctor.lastName}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.textContent = `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase();
                      }}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%'
                    }}>
                      {`${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Bilgiler */}
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isDark ? "#f3f4f6" : "#1a4d5f",
                  margin: "0 0 8px 0"
                }}>
                  {doctor.firstName} {doctor.lastName}
                </h3>
                <div style={{
                  color: isDark ? "#60a5fa" : "#5a9fb8",
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 16
                }}>
                  {DEPARTMENT_KEYS[doctor.specialization]
                    ? t(`medical:departments.list.${DEPARTMENT_KEYS[doctor.specialization]}.title`)
                    : (doctor.specialization || doctor.role)}
                </div>

                <button style={{
                  background: "#ff6600",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: "pointer"
                }}>
                  {t('medical:doctors.select_and_proceed')}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SelectDoctorPage;