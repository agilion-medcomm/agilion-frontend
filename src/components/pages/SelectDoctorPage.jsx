import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// API Adresini diğer sayfalardaki gibi tanımlıyoruz
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

// 8 Bölüm
const DEPARTMENTS = [
  'Acil 7/24',
  'Ağız ve Diş',
  'Beslenme Diyet',
  'Dermatoloji',
  'Genel Cerrahi',
  'Göz Sağlığı',
  'İç Hastalıklar',
  'Kadın & Doğum'
];

import { useTheme } from "../../context/ThemeContext";

const SelectDoctorPage = () => {
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
      <h3>Yükleniyor...</h3>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c1272d', backgroundColor: isDark ? '#111827' : 'transparent' }}>
      <h3>Hata: {error}</h3>
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
          Randevu Almak İçin Doktor Seçiniz
        </h2>
        <p style={{
          textAlign: "left",
          color: isDark ? "#9ca3af" : "#666",
          marginBottom: 30
        }}>
          İşlem yapmak istediğiniz hekimin üzerine tıklayınız.
        </p>

        {/* BÖLÜMLERİ GÖRE FİLTRE */}
        <div style={{ maxWidth: 400, margin: '0 0 50px 0' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontWeight: '600',
            color: isDark ? '#e5e7eb' : '#0e2b4b'
          }}>Bölüme Göre Filtrele:</label>
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
            <option value="">Tüm Bölümler</option>
            {DEPARTMENTS.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
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
                {/* Avatar Alanı */}
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: isDark ? "#374151" : "#f0f8ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                    overflow: "hidden",
                    border: isDark ? "3px solid #4b5563" : "3px solid #5a9fb8",
                    fontSize: 32,
                    fontWeight: 700,
                    color: isDark ? "#94a3b8" : "#1a4d5f"
                  }}
                >
                  {doctor.photoUrl ? (
                    <img
                      src={doctor.photoUrl.startsWith('http') ? doctor.photoUrl : `${API_BASE}${doctor.photoUrl}`}
                      alt={doctor.firstName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase()
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
                  {doctor.specialization || doctor.role}
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
                  Seç ve İlerle
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SelectDoctorPage;