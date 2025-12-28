import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './CleanerDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

const AREAS = [
  "Zemin Kat Koridor",
  "Zemin Kat Tuvalet",
  "1. Kat Koridor",
  "1. Kat Tuvalet",
  "2. Kat Koridor",
  "2. Kat Tuvalet",
  "3. Kat Koridor",
  "Acil Servis",
  "Ameliyathane",
  "Yoğun Bakım",
  "Laboratuvar",
  "Radyoloji",
  "Kafeterya",
  "Bekleme Salonu"
];

export default function CleanerDashboard() {
  const { user } = usePersonnelAuth();

  const [cleaningRecords, setCleaningRecords] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  const isToday = viewDate === new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchCompletedAreas();
  }, [viewDate]);

  const fetchCompletedAreas = async () => {
    const token = localStorage.getItem('personnelToken');
    if (!token) return;

    try {
      const res = await axios.get(`${BaseURL}/cleaning`, {
        params: { date: viewDate },
        headers: { Authorization: `Bearer ${token}` }
      });

      setCleaningRecords(res.data.data || []);
    } catch (err) {
      console.error("Tamamlanan alanlar çekilemedi:", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isToday) {
      setError("Geçmiş tarihler için kayıt oluşturulamaz.");
      return;
    }

    if (!selectedArea) {
      setError("Lütfen bir alan seçiniz.");
      return;
    }
    if (!selectedTime) {
      setError("Lütfen bir zaman dilimi seçiniz.");
      return;
    }
    if (!selectedFile) {
      setError("Lütfen bir fotoğraf yükleyiniz.");
      return;
    }

    const token = localStorage.getItem('personnelToken');
    if (!token) {
      setError("Oturum süreniz dolmuş.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('area', selectedArea);
      formData.append('time', selectedTime);
      formData.append('photo', selectedFile);

      await axios.post(`${BaseURL}/cleaning`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage("Temizlik kaydı başarıyla oluşturuldu.");
      setSelectedArea("");
      setSelectedTime("");
      setSelectedFile(null);
      document.getElementById('photoInput').value = "";

      fetchCompletedAreas();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Kayıt oluşturulurken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cleaner-dashboard">
      <div className="cleaner-header">
        <div>
          <h2 style={{ margin: 0 }}>Temizlik Personeli Paneli</h2>
          <p style={{ margin: 0 }}>Hoşgeldiniz, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div className="cleaner-content">
        <div className="cleaner-grid">

          <div className="cleaner-card">
            <h3 className="cleaner-card-title">Yeni Temizlik Kaydı</h3>
            {!isToday && (
              <div className="msg-alert msg-warning">
                ⚠️ Sadece bugün için yeni kayıt ekleyebilirsiniz. Yeni kayıt eklemek için bugünü seçiniz.
              </div>
            )}
            <form onSubmit={handleSubmit} className="cleaner-form">

              <div className="cleaner-form-group">
                <label className="cleaner-label">Temizlenen Alan:</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="cleaner-select"
                  disabled={isLoading || !isToday}
                >
                  <option value="">Alan Seçiniz</option>
                  {AREAS.map((area, index) => (
                    <option key={index} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="cleaner-form-group">
                <label className="cleaner-label">Zaman Dilimi:</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="cleaner-select"
                  disabled={isLoading || !isToday}
                >
                  <option value="">Zaman Seçiniz</option>
                  <option value="Sabah">Sabah</option>
                  <option value="Öğle">Öğle</option>
                  <option value="Akşam">Akşam (Mesai Çıkışı)</option>
                </select>
              </div>

              <div className="cleaner-form-group">
                <label className="cleaner-label">Fotoğraf Yükleyiniz:</label>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="cleaner-input"
                  disabled={isLoading || !isToday}
                />
              </div>

              {error && <div className="msg-alert msg-error">{error}</div>}
              {message && <div className="msg-alert msg-success">{message}</div>}

              <button type="submit" className="cleaner-submit-btn" disabled={isLoading || !isToday}>
                {isLoading ? 'Gönderiliyor...' : 'Kaydet ve Gönder'}
              </button>
            </form>
          </div>

          <div className="cleaner-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--dash-border)', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Günlük Temizlik Durumu</h3>
              <input
                type="date"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                className="cleaner-date-input"
              />
            </div>

            <div className="cleaner-table-wrapper">
              <table className="cleaner-table">
                <thead>
                  <tr>
                    <th>Alan Adı</th>
                    <th>Zaman</th>
                    <th style={{ textAlign: 'center' }}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((area, index) => {
                    const areaRecords = cleaningRecords.filter(r => r.area === area);
                    const isCompleted = areaRecords.length > 0;

                    return (
                      <tr key={index}>
                        <td>{area}</td>
                        <td>
                          {isCompleted ? (
                            areaRecords.map((rec, i) => (
                              <span key={i} className="time-badge">
                                {rec.time || '-'}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: 'var(--dash-text-muted)' }}>-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {isCompleted ? (
                            <span className="status-done">✔ Tamamlandı</span>
                          ) : (
                            <span className="status-pending">✘ Bekliyor</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
