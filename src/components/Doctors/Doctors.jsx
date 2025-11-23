import React, { useState, useEffect } from "react";
import "./Doctors.css";
// react-transition-group import'larına artık gerek yok.

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/v1/doctors')
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


  // Tüm doktorları tek seferde göster

  return (
    <section className="doctors-section" id="hekimlerimiz">
      <div className="doctors-header">
        <h2>Alanında Uzman Hekimlerimiz</h2>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>Yükleniyor...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: 32 }}>{error}</div>
      ) : (
        <div className="doctors-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
          {doctors.map((doc, i) => (
            <div className="doctor-card" key={doc.id || i} style={{ minWidth: 220, maxWidth: 260, flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 18, marginBottom: 8 }}>
              {doc.img ? (
                <img src={doc.img} alt={doc.firstName + ' ' + doc.lastName} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '50%', marginBottom: 12, background: '#f3f6fa' }} />
              ) : (
                <div style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: '#e3eaf2',
                  color: '#357d91',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                  fontWeight: 700,
                  marginBottom: 12,
                  userSelect: 'none',
                  letterSpacing: 2
                }}>
                  {`${doc.firstName?.[0] || ''}${doc.lastName?.[0] || ''}`.toUpperCase()}
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '8px 0 2px 0', color: '#1a4d5f' }}>{doc.firstName} {doc.lastName}</h3>
              <p style={{ fontSize: 15, color: '#357d91', margin: 0 }}>{doc.specialization || doc.role || ''}</p>
              {/* Telefon ekranda gösterilmiyor */}
              {/* E-posta ekranda gösterilmiyor */}
              <button
                style={{
                  marginTop: 16,
                  background: '#ff6600',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(255,102,0,0.10)',
                  transition: 'background 0.2s',
                }}
                onClick={() => { /* Randevu al tıklama */ }}
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