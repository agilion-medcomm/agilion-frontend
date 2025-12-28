import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import { useTheme } from '../../context/ThemeContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const BaseURL = `${API_BASE}/api/v1`;

// Available areas matching what cleaners can select
const areas = [
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

export default function CleaningManagementPage() {
  const { user } = usePersonnelAuth();
  const { theme } = useTheme();
  const [cleaningRecords, setCleaningRecords] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areaFilter, setAreaFilter] = useState('ALL');
  const [cleanerFilter, setCleanerFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');

    try {
      // Fetch personnel to get cleaners
      const personnelRes = await axios.get(`${BaseURL}/personnel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allCleaners = (personnelRes.data?.data || []).filter(p => p.role === 'CLEANER');
      setCleaners(allCleaners);

      // Fetch real cleaning records from API
      const cleaningRes = await axios.get(`${BaseURL}/cleaning`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const records = (cleaningRes.data?.data || []).map(record => ({
        id: record.id,
        cleanerId: record.cleaner?.user?.id,
        cleanerName: record.cleaner?.user ? `${record.cleaner.user.firstName} ${record.cleaner.user.lastName}` : 'Unknown',
        area: record.area,
        zone: record.area, // For backward compatibility
        date: record.date,
        time: record.time,
        status: 'Completed',
        photoUrl: record.photoUrl,
        createdAt: record.createdAt
      }));

      setCleaningRecords(records);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPhoto = (photoUrl) => {
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  const filteredRecords = cleaningRecords.filter(record => {
    if (areaFilter !== 'ALL' && record.area !== areaFilter) return false;
    if (cleanerFilter !== 'ALL' && record.cleanerId !== parseInt(cleanerFilter)) return false;
    if (dateFilter && record.date !== dateFilter) return false;
    return true;
  });

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Temizlik Yönetimi</h1>
          <p className="page-subtitle">Temizlik kayıtlarını görüntüle ve yönet</p>
        </div>
        <button className="btn-primary" onClick={fetchData}>
          ↻ Yenile
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Alana Göre Filtrele</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 10px',
                border: '1px solid var(--dash-border)',
                borderRadius: '8px',
                background: 'var(--dash-card-bg)',
                color: 'var(--dash-text)',
                boxSizing: 'border-box'
              }}
            >
              <option value="ALL">Tüm Alanlar</option>
              {areas.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Temizlikçiye Göre Filtrele</label>
            <select
              value={cleanerFilter}
              onChange={(e) => setCleanerFilter(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 10px',
                border: '1px solid var(--dash-border)',
                borderRadius: '8px',
                background: 'var(--dash-card-bg)',
                color: 'var(--dash-text)',
                boxSizing: 'border-box'
              }}
            >
              <option value="ALL">Tüm Temizlikçiler</option>
              {cleaners.map(cleaner => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.firstName} {cleaner.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Tarihe Göre Filtrele</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 10px',
                border: '1px solid var(--dash-border)',
                borderRadius: '8px',
                background: 'var(--dash-card-bg)',
                color: 'var(--dash-text)',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {(areaFilter !== 'ALL' || cleanerFilter !== 'ALL' || dateFilter) && (
            <div className="form-group" style={{ margin: 0, display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { setAreaFilter('ALL'); setCleanerFilter('ALL'); setDateFilter(''); }}
                style={{ padding: '10px 16px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cleaning Records Table */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Temizlik Kayıtları</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Temizlikçi</th>
                <th>Alan</th>
                <th>Tarih</th>
                <th>Zaman</th>
                <th>Durum</th>
                <th>Fotoğraf</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr><td colSpan="6" className="no-data">Temizlik kaydı bulunamadı</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.cleanerName}</td>
                    <td>{record.area}</td>
                    <td>{new Date(record.date).toLocaleDateString('tr-TR')}</td>
                    <td>{record.time}</td>
                    <td><span className="badge badge-completed">Tamamlandı</span></td>
                    <td>
                      {record.photoUrl ? (
                        <button
                          className="btn-sm"
                          style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          onClick={() => handleViewPhoto(record.photoUrl)}
                        >
                          Görüntüle
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Fotoğraf yok</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo View Modal */}
      {showPhotoModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPhotoModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: theme === 'dark' ? '#1e293b' : 'white',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
              boxShadow: theme === 'dark' ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ 
                margin: 0,
                color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
                fontSize: '20px',
                fontWeight: 700
              }}>Temizlik Fotoğrafı</h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                style={{
                  background: theme === 'dark' ? '#334155' : '#f1f5f9',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = theme === 'dark' ? '#475569' : '#e2e8f0'}
                onMouseOut={(e) => e.target.style.background = theme === 'dark' ? '#334155' : '#f1f5f9'}
              >
                ×
              </button>
            </div>
            <div style={{ 
              textAlign: 'center',
              background: theme === 'dark' ? '#0f172a' : '#f8fafc',
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`
            }}>
              <img
                src={`${API_BASE}${selectedPhoto}`}
                alt="Temizlik fotoğrafı"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  borderRadius: '8px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f1f5f9" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14">Fotoğraf yüklenemedi</text></svg>';
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ 
          padding: '20px', 
          background: theme === 'dark' ? '#065f46' : '#f0fdf4', 
          borderRadius: '12px', 
          border: `1px solid ${theme === 'dark' ? '#047857' : '#86efac'}` 
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: theme === 'dark' ? '#d1fae5' : '#166534' }}>Toplam Kayıt</p>
          <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '700', color: theme === 'dark' ? '#d1fae5' : '#166534' }}>{cleaningRecords.length}</p>
        </div>
        <div style={{ 
          padding: '20px', 
          background: theme === 'dark' ? '#1e3a8a' : '#eff6ff', 
          borderRadius: '12px', 
          border: `1px solid ${theme === 'dark' ? '#1e40af' : '#93c5fd'}` 
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: theme === 'dark' ? '#dbeafe' : '#1e40af' }}>Aktif Temizlikçi</p>
          <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '700', color: theme === 'dark' ? '#dbeafe' : '#1e40af' }}>{cleaners.length}</p>
        </div>
        <div style={{ 
          padding: '20px', 
          background: theme === 'dark' ? '#854d0e' : '#fefce8', 
          borderRadius: '12px', 
          border: `1px solid ${theme === 'dark' ? '#a16207' : '#fde047'}` 
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: theme === 'dark' ? '#fef3c7' : '#854d0e' }}>Bugünkü Kayıtlar</p>
          <p style={{ margin: '8px 0 0', fontSize: '24px', fontWeight: '700', color: theme === 'dark' ? '#fef3c7' : '#854d0e' }}>
            {cleaningRecords.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
      </div>
    </div>
  );
}
