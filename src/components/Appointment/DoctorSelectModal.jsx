// src/components/Appointment/DoctorSelectModal.jsx (YENİ DOSYA)

import React, { useState, useEffect } from 'react';
import './Appointment.css'; // Ortak stil dosyası

export default function DoctorSelectModal({ onClose, onDoctorSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Tüm doktorları çekmek için mock API çağrısı
    fetch('http://localhost:3000/api/v1/doctors')
      .then(res => {
        if (!res.ok) throw new Error('Doktorlar yüklenemedi.');
        return res.json();
      })
      .then(data => {
        setDoctors(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Doktor listesi yüklenirken hata: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleDoctorClick = (doc) => {
    onDoctorSelect(doc); // Seçilen doktoru ana randevu modalini açmak için gönder
  };

  const DoctorCard = ({ doc }) => (
    <div 
        className="doctor-selection-card" 
        onClick={() => handleDoctorClick(doc)}
    >
      <div className="doctor-avatar-small">
        {/* Fotoğraf yoksa baş harflerini göster */}
        {`${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`.toUpperCase()}
      </div>
      <div className="info">
        <div className="name">{doc.firstName} {doc.lastName}</div>
        <div className="specialization">{doc.specialization || doc.role}</div>
      </div>
      <div className="select-btn">Seç</div>
    </div>
  );

  return (
    <div className="doctor-select-modal-overlay" onClick={onClose}>
      <div className="doctor-select-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">Randevu Almak İçin Doktor Seçin</h2>
        
        {loading ? (
            <div style={{textAlign: 'center', padding: 20}}>Doktor Listesi Yükleniyor...</div>
        ) : error ? (
            <div style={{color: 'red', textAlign: 'center', padding: 20}}>{error}</div>
        ) : (
            <div className="doctor-list-grid">
                {doctors.map(doc => <DoctorCard key={doc.id} doc={doc} />)}
            </div>
        )}
      </div>
    </div>
  );
}