// src/components/DoctorSlider/DoctorSlider.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext"; 
import "./DoctorSlider.css"; 

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const ITEMS_PER_PAGE = 4; // Her sayfada maksimum 4 doktor

export default function DoctorSlider() {
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
      alert("Randevu almak için önce giriş yapmalısınız.");
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
          <h2>Alanında uzman, deneyimli hekimlerimiz</h2>
        </div>

        {loading ? (
          <div className="slider-loading">Yükleniyor...</div>
        ) : error ? (
          <div className="slider-error">Hata: {error}</div>
        ) : (
          <div className="doctor-slider-wrapper">
            {/* Navigasyon Butonları */}
            {totalPages > 1 && (
                <div className="slider-navigation">
                    <button onClick={handlePrev} disabled={currentPage === 0} className="slider-nav-btn prev">
                        <img src="/back.png" alt="Geri" />
                    </button>
                    <button onClick={handleNext} disabled={currentPage === totalPages - 1} className="slider-nav-btn next">
                        <img src="/next.png" alt="İleri" />
                    </button>
                </div>
            )}
            
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
                  <p className="slider-doctor-specialization">{doc.specialization || doc.role || ''}</p>
                  
                  <button
                    className="slider-appointment-button"
                    onClick={() => handleAppointmentClick(doc)}
                  >
                    Hızlı Randevu al
                  </button>
                </div>
              ))}
            </div>
            <div className="slider-pagination-info">
              {currentPage + 1} / {totalPages}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}