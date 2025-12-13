import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Doctors.css";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

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

export default function Doctors() {
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

  // Doktor kartına (veya içindeki butona) tıklayınca çalışacak fonksiyon
  const handleDoctorCardClick = (doc) => {
    console.log('Seçilen Doktor:', doc);

    // 1. Giriş kontrolü
    if (!patientUser) {
      alert('Randevu almak için önce giriş yapınız.');
      navigate('/login');
      return;
    }

    // 2. Doktor verisiyle randevu sayfasına git
    navigate('/randevu', { state: { doctor: doc } });
  };

  return (
    <section className="doctors-section" id="hekimlerimiz">
      <div className="doctors-header">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', textAlign: 'left' }}>
          <h2>Alanında Uzman Hekimlerimiz</h2>
        </div>
      </div>

      {/* BÖLÜMLERİ GÖRE FİLTER */}
      <div className="doctors-filter-container">
        <label className="filter-label">Bölüme Göre Filtrele:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="department-select"
        >
          <option value="">Tüm Bölümler</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>Yükleniyor...</div>
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
                onClick={() => handleDoctorCardClick(doc)}
              >
                {doc.img ? (
                  <img
                    src={doc.img.startsWith('http') ? doc.img : `${API_BASE}${doc.img}`}
                    alt={doc.firstName + ' ' + doc.lastName}
                    className="doctor-photo"
                  />
                ) : (
                  <div className="doctor-photo-placeholder">
                    {`${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`.toUpperCase()}
                  </div>
                )}
                <h3>{doc.firstName} {doc.lastName}</h3>
                <p>{doc.specialization || doc.role || ''}</p>

                <button
                  className="appointment-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoctorCardClick(doc);
                  }}
                >
                  Hızlı Randevu al
                </button>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}