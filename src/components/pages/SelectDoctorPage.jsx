import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// API Adresini diğer sayfalardaki gibi tanımlıyoruz
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

const SelectDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

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
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h3>Yükleniyor...</h3>
    </div>
  );
  
  if (error) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c1272d' }}>
      <h3>Hata: {error}</h3>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 20px", minHeight: '80vh' }}>
      <h2 style={{ textAlign: "center", color: "#0e2b4b", marginBottom: 10, fontSize: '2rem' }}>
        Randevu Almak İçin Doktor Seçiniz
      </h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: 50 }}>
        İşlem yapmak istediğiniz hekimin üzerine tıklayınız.
      </p>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
        gap: 24 
      }}>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => handleSelect(doctor)}
            style={{
              cursor: "pointer",
              background: "#fff",
              borderRadius: 16,
              padding: "24px 16px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              border: "1px solid #eff2f7",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            }}
          >
            {/* Avatar Alanı */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#f0f8ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                overflow: "hidden",
                border: "3px solid #5a9fb8",
                fontSize: 32,
                fontWeight: 700,
                color: "#1a4d5f"
              }}
            >
              {doctor.img ? (
                <img src={doctor.img} alt={doctor.firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase()
              )}
            </div>

            {/* Bilgiler */}
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a4d5f", margin: "0 0 8px 0" }}>
              {doctor.firstName} {doctor.lastName}
            </h3>
            <div style={{ color: "#5a9fb8", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
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
  );
};

export default SelectDoctorPage;