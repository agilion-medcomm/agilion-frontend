import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// 9. [FE] Cleaning Areas List (Static Data)
const AREAS = [
  "Zemin Kat Koridor",
  "1. Kat Tuvalet",
  "Acil Servis Girişi",
  "Kafeterya",
  "Poliklinik Bekleme Alanı",
  "Ameliyathane Koridoru",
  "Laboratuvar Girişi",
  "Röntgen Bekleme Salonu",
  "2. Kat Koridor",
  "3. Kat Koridor"
];

export default function CleanerDashboard() {
  const { user } = usePersonnelAuth();

  // 10. [FE] State Management
  const [cleaningRecords, setCleaningRecords] = useState([]); // List of full records
  const [selectedArea, setSelectedArea] = useState(""); // Area selected from the dropdown
  const [selectedTime, setSelectedTime] = useState(""); // Time selected
  const [selectedFile, setSelectedFile] = useState(null); // Photo to be uploaded
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Date state for viewing records
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);

  // Check if the selected view date is today
  const isToday = viewDate === new Date().toISOString().split('T')[0];

  // Fetch completed areas on mount and when viewDate changes
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
      // Store full records
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
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Temizlik Personeli Paneli</h2>
          <p style={{ margin: 0, color: '#666' }}>Hoşgeldiniz, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.gridContainer}>

          {/* 12. [FE] Upload Form (Left Side) */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Yeni Temizlik Kaydı</h3>
            {!isToday && (
              <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '6px', fontSize: '0.9rem' }}>
                ⚠️ Sadece bugün için yeni kayıt ekleyebilirsiniz. Yeni kayıt eklemek için bugünü seçiniz.
              </div>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>

              <div style={styles.formGroup}>
                <label style={styles.label}>Temizlenen Alan:</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  style={styles.select}
                  disabled={isLoading || !isToday}
                >
                  <option value="">Alan Seçiniz</option>
                  {AREAS.map((area, index) => (
                    <option key={index} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Zaman Dilimi:</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  style={styles.select}
                  disabled={isLoading || !isToday}
                >
                  <option value="">Zaman Seçiniz</option>
                  <option value="Sabah">Sabah</option>
                  <option value="Öğle">Öğle</option>
                  <option value="Akşam">Akşam (Mesai Çıkışı)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Fotoğraf Yükleyiniz:</label>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  style={styles.input}
                  disabled={isLoading || !isToday}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}
              {message && <div style={styles.success}>{message}</div>}

              <button type="submit" style={styles.submitBtn} disabled={isLoading || !isToday}>
                {isLoading ? 'Gönderiliyor...' : 'Kaydet ve Gönder'}
              </button>
            </form>
          </div>

          {/* 11. [FE] Table Structure (Right Side) */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#1f2937' }}>Günlük Temizlik Durumu</h3>
              <input
                type="date"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '2px solid #4e80ee',
                  color: '#4e80ee',
                  fontSize: '1.0rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Alan Adı</th>
                    <th style={styles.th}>Zaman</th>
                    <th style={styles.th}>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {AREAS.map((area, index) => {
                    // Find the record for this area (if any)
                    // Note: There might be multiple records for the same area (different times).
                    // For this simple table, we might want to show the latest status or list all.
                    // The user asked for "cleaning status" section.
                    // Let's list the area rows, and if completed, show the time.
                    // If multiple times, maybe we should show multiple badges or just the latest?
                    // Let's assume we want to see if it's done for *any* time today, or list the times it was done.

                    // Better approach: Iterate over AREAS. Check if there are records for this area.
                    const areaRecords = cleaningRecords.filter(r => r.area === area);
                    const isCompleted = areaRecords.length > 0;

                    return (
                      <tr key={index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                        <td style={styles.td}>{area}</td>
                        <td style={styles.td}>
                          {isCompleted ? (
                            areaRecords.map((rec, i) => (
                              <span key={i} style={{ marginRight: '5px', fontSize: '0.85rem', background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>
                                {rec.time || '-'}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#9ca3af' }}>-</span>
                          )}
                        </td>
                        <td style={styles.tdCenter}>
                          {isCompleted ? (
                            <span style={styles.statusDone}>✔ Tamamlandı</span>
                          ) : (
                            <span style={styles.statusPending}>✘ Bekliyor</span>
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

const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f3f4f6', minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '15px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' },
  content: { maxWidth: '1200px', margin: '0 auto' },
  gridContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  cardTitle: { marginTop: 0, marginBottom: '20px', color: '#1f2937', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontWeight: '600', color: '#094ab3ff', fontSize: '0.9rem' },
  select: { padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1.2rem' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1.2rem' },
  submitBtn: { backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '100px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' },
  error: { color: '#dc2626', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' },
  success: { color: '#059669', backgroundColor: '#d1fae5', padding: '10px', borderRadius: '6px', fontSize: '0.9rem' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' },
  th: { textAlign: 'left', padding: '12px', backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb', color: '#4b5563', fontWeight: '600' },
  td: { padding: '12px', borderBottom: '1px solid #e5e7eb', color: '#1f2937' },
  tdCenter: { padding: '12px', borderBottom: '1px solid #e5e7eb', textAlign: 'center' },
  trEven: { backgroundColor: '#fff' },
  trOdd: { backgroundColor: '#f9fafb' },
  statusDone: { color: '#059669', fontWeight: 'bold', backgroundColor: '#d1fae5', padding: '4px 8px', borderRadius: '16px', fontSize: '0.95rem' },
  statusPending: { color: '#dc2626', fontWeight: 'bold', backgroundColor: '#fee2e2', padding: '4px 8px', borderRadius: '16px', fontSize: '0.95rem' }
};
