import React, { useState } from 'react';
import axios from 'axios';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

export default function LabResultsPage() {
  const [tckn, setTckn] = useState('');
  const [results, setResults] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!tckn || tckn.length !== 11) {
      setMessage({ type: 'error', text: 'Geçerli 11 haneli TCKN giriniz' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('personnelToken');
      
      // Önce hasta bilgilerini alalım
      const patientRes = await axios.get(`${BaseURL}/patients/search`, {
        params: { tckn },
        headers: { Authorization: `Bearer ${token}` }
      });

      const patient = patientRes.data.data;
      setPatientInfo(patient);

      // Sonra bu hastanın lab isteklerini alalım
      const resultsRes = await axios.get(`${BaseURL}/lab-requests`, {
        params: { 
          patientId: patient.patientId,
          status: 'COMPLETED'
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Randevu bilgilerini de alalım
      const appointmentsRes = await axios.get(`${BaseURL}/appointments`, {
        params: {
          list: 'true',
          patientId: patient.patientId
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(resultsRes.data.data || []);
      setAppointments(appointmentsRes.data.data || []);
      setSearchPerformed(true);
      
      if (!resultsRes.data.data || resultsRes.data.data.length === 0) {
        setMessage({ type: 'info', text: 'Bu hastanın tamamlanmış lab sonucu bulunmuyor' });
      }
    } catch (error) {
      setSearchPerformed(true);
      setPatientInfo(null);
      setResults([]);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Arama yapılamadı'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTckn('');
    setResults([]);
    setAppointments([]);
    setPatientInfo(null);
    setMessage({ type: '', text: '' });
    setSearchPerformed(false);
  };

  const downloadFile = (fileId, fileName) => {
    const token = localStorage.getItem('personnelToken');
    const link = document.createElement('a');
    link.href = `${BaseURL}/medical-files/${fileId}/download`;
    link.setAttribute('Authorization', `Bearer ${token}`);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">🧪 Lab Sonuçları</h1>
          <p className="page-subtitle">Hasta TC'si ile lab sonuçlarını arayın</p>
        </div>
      </div>

      {/* Search Form */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
              Hasta TCKN'si
            </label>
            <input
              type="text"
              value={tckn}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) setTckn(value);
              }}
              placeholder="11 haneli TCKN'yi girin"
              maxLength={11}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#cbd5e1' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            {loading ? '🔄 Aranıyor...' : '🔍 Ara'}
          </button>
          {searchPerformed && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: '12px 24px',
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              Temizle
            </button>
          )}
        </form>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '24px',
          borderRadius: '8px',
          background: message.type === 'error' ? '#fee2e2' : message.type === 'info' ? '#dbeafe' : '#dcfce7',
          color: message.type === 'error' ? '#991b1b' : message.type === 'info' ? '#0c4a6e' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : message.type === 'info' ? '#93c5fd' : '#86efac'}`
        }}>
          {message.text}
        </div>
      )}

      {/* Results */}
      {patientInfo && (
        <div>
          {/* Patient Info Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700 }}>
              👤 Hasta Bilgileri
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Ad Soyad</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>
                  {patientInfo.firstName} {patientInfo.lastName}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>TCKN</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>
                  {patientInfo.tckn}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '12px' }}>Email</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 600 }}>
                  {patientInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* Results Table */}
          {results && results.length > 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                padding: '16px 24px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                  📋 Tamamlanan Lab Sonuçları ({results.length})
                </h3>
              </div>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Test Adı
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Talep Eden
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Talep Tarihi
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Atanan Laborant
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px', color: '#1f2937', fontWeight: 600 }}>
                        {result.fileTitle}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        Dr. {result.createdByUser.firstName} {result.createdByUser.lastName}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {new Date(result.requestedAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {result.assigneeLaborant ? (
                          `${result.assigneeLaborant.user.firstName} ${result.assigneeLaborant.user.lastName}`
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {result.medicalFile ? (
                          <button
                            onClick={() => downloadFile(result.medicalFile.id, result.medicalFile.testName)}
                            style={{
                              padding: '6px 12px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            📥 İndir
                          </button>
                        ) : (
                          <span style={{
                            background: '#fef3c7',
                            color: '#92400e',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            ⏳ Bekleniyor
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            searchPerformed && (
              <div style={{
                background: 'white',
                padding: '60px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '8px', color: '#1f2937' }}>
                  📭 Sonuç Bulunamadı
                </p>
                <p style={{ color: '#94a3b8' }}>
                  Bu hastanın tamamlanmış lab sonucu bulunmuyor
                </p>
              </div>
            )
          )}

          {/* Appointments Table */}
          {appointments && appointments.length > 0 && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginTop: '24px'
            }}>
              <div style={{
                padding: '16px 24px',
                background: '#f9fafb',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                  📅 Randevular ({appointments.length})
                </h3>
              </div>
              <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Doktor
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Tarih & Saat
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Klinik
                    </th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px', color: '#1f2937', fontWeight: 600 }}>
                        Dr. {app.doctor?.firstName || 'N/A'} {app.doctor?.lastName || ''}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {new Date(app.date).toLocaleDateString('tr-TR')} {app.time || ''}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {app.clinic || '-'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          background: app.status === 'APPROVED' ? '#d1fae5' : 
                                    app.status === 'PENDING' ? '#fef3c7' :
                                    app.status === 'CANCELLED' ? '#fee2e2' : '#f0f0f0',
                          color: app.status === 'APPROVED' ? '#065f46' : 
                                app.status === 'PENDING' ? '#92400e' :
                                app.status === 'CANCELLED' ? '#991b1b' : '#666'
                        }}>
                          {app.status === 'APPROVED' ? '✅ Onaylandı' : 
                          app.status === 'PENDING' ? '⏳ Beklemede' :
                          app.status === 'CANCELLED' ? '❌ İptal' : app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Initial State */}
      {!searchPerformed && !patientInfo && (
        <div style={{
          background: 'white',
          padding: '60px 20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '16px', marginBottom: '8px', color: '#1f2937' }}>
            🔍 Arama Yapın
          </p>
          <p style={{ color: '#94a3b8' }}>
            Hasta TCKN'sini girerek tahlil sonuçlarını arayın
          </p>
        </div>
      )}
    </div>
  );
}
