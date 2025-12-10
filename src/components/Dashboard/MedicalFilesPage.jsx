import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

export default function MedicalFilesPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const token = localStorage.getItem('personnelToken');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseURL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Hastalar yüklenemedi' });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = async (patientId) => {
    setSelectedPatientId(patientId);
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // patientId kullan (Patient tablosundaki id), userId değil
      const response = await axios.get(`${BaseURL}/medical-files/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicalFiles(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Medical files error:', error);
      setMessage({ type: 'error', text: 'Tıbbi dosyalar yüklenemedi' });
      setMedicalFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      // Backend'deki güvenli download endpoint'ini kullan
      const response = await axios.get(`${BaseURL}/medical-files/${fileId}/download`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: 'Dosya indirilemedi' });
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">📋 Tıbbi Dosyalar</h1>
          <p className="page-subtitle">Hastaların tıbbi raporlarını ve dosyalarını görüntüleyin</p>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#f87171' : '#86efac'}`,
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px', marginTop: '20px' }}>
        {/* Patient List */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
            Hastalar
          </h3>
          {loading && !selectedPatientId ? (
            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Yükleniyor...</p>
          ) : patients.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Hasta bulunamadı</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {patients.map((patient) => (
                <button
                  key={patient.patientId || patient.id}
                  onClick={() => handlePatientSelect(patient.patientId || patient.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: selectedPatientId === (patient.patientId || patient.id) ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                    background: selectedPatientId === (patient.patientId || patient.id) ? '#eff6ff' : 'white',
                    color: selectedPatientId === (patient.patientId || patient.id) ? '#1e40af' : '#334155',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (selectedPatientId !== (patient.patientId || patient.id)) {
                      e.target.style.background = '#f8fafc';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedPatientId !== (patient.patientId || patient.id)) {
                      e.target.style.background = 'white';
                    }
                  }}
                >
                  {patient.firstName} {patient.lastName}
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {patient.email}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Medical Files */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {!selectedPatientId ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#94a3b8'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>📂 Hasta seçiniz</p>
              <p style={{ fontSize: '14px' }}>Dosyalarını görmek için sol taraftan bir hasta seçin</p>
            </div>
          ) : loading ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Yükleniyor...</p>
          ) : medicalFiles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#94a3b8'
            }}>
              <p style={{ fontSize: '16px', marginBottom: '8px' }}>📭 Dosya bulunamadı</p>
              <p style={{ fontSize: '14px' }}>Bu hastanın henüz tıbbi dosyası yüklenmemiş</p>
            </div>
          ) : (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
                Tıbbi Dosyalar ({medicalFiles.length})
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {medicalFiles.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#1e293b' }}>
                        📄 {file.testName}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b' }}>
                        Dosya: {file.fileName}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                        Tarih: {new Date(file.testDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file.id, file.fileName)}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#3b82f6',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '13px',
                        whiteSpace: 'nowrap',
                        marginLeft: '16px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#2563eb'}
                      onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                    >
                      ⬇️ İndir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
