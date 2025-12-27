import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';
import './PatientsPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function PatientsPage() {
  const { user } = usePersonnelAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [expandedTab, setExpandedTab] = useState(null); // 'appointments' or 'labResults'
  const [appointmentsSubTab, setAppointmentsSubTab] = useState('past'); // 'past' or 'upcoming'
  const [appointments, setAppointments] = useState({});
  const [loadingAppointments, setLoadingAppointments] = useState({});
  const [labResults, setLabResults] = useState({});
  const [loadingLabResults, setLoadingLabResults] = useState({});
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [viewMode, setViewMode] = useState('search'); // 'search' or 'all'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const token = localStorage.getItem('personnelToken');

  useEffect(() => {
    // No initial fetch needed - search by TCKN only
  }, []);

  const fetchAllPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BaseURL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data?.data?.users || res.data?.users || []);
      setViewMode('all');
    } catch (err) {
      console.error('Error fetching all patients:', err);
      setError(err.response?.data?.message || 'Hastalar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    try {
      await axios.delete(`${BaseURL}/patients/${selectedPatient.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      setSelectedPatient(null);
      setShowDeleteConfirm(false);
      alert('Hasta başarıyla silindi.');
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert(err.response?.data?.message || 'Hasta silinirken hata oluştu.');
    }
  };

  const searchPatientByTckn = async (tckn) => {
    if (!tckn.trim()) {
      setError('TCKN bulunamadı. Lütfen geçerli bir TC numarası girin.');
      setPatients([]);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchError(null);

    if (!token) {
      setError('Kimlik doğrulama tokeni bulunamadı. Lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BaseURL}/patients/search`, {
        params: { tckn },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Response'da single patient object döner, bunu array'e dönüştür
      const patient = res.data?.data;
      if (patient) {
        setPatients([patient]);
      } else {
        setPatients([]);
        setSearchError('Hasta bulunamadı.');
      }
    } catch (error) {
      console.error('Error searching patient:', error);
      setError(error.response?.data?.message || 'Hasta aranırken hata oluştu.');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchPatientByTckn(searchQuery);
  };

  const fetchAppointments = async (patientId) => {
    if (appointments[patientId]) {
      return;
    }

    setLoadingAppointments(prev => ({ ...prev, [patientId]: true }));
    try {
      const url = `${BaseURL}/appointments?list=true&patientId=${patientId}`;
      console.log('Fetching from URL:', url);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Appointments fetched for patient', patientId, ':', res.data?.data);
      setAppointments(prev => ({ ...prev, [patientId]: res.data?.data || [] }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments(prev => ({ ...prev, [patientId]: [] }));
    } finally {
      setLoadingAppointments(prev => ({ ...prev, [patientId]: false }));
    }
  };

  const fetchLabResults = async (patientId) => {
    if (labResults[patientId]) {
      return;
    }

    setLoadingLabResults(prev => ({ ...prev, [patientId]: true }));
    try {
      const res = await axios.get(`${BaseURL}/medical-files/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Lab results fetched for patient', patientId, ':', res.data?.data);
      setLabResults(prev => ({ ...prev, [patientId]: res.data?.data || [] }));
    } catch (error) {
      console.error('Error fetching lab results:', error);
      setLabResults(prev => ({ ...prev, [patientId]: [] }));
    } finally {
      setLoadingLabResults(prev => ({ ...prev, [patientId]: false }));
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${BaseURL}/medical-files/${fileId}/download`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

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
      alert('Dosya indirilemedi');
    }
  };

  const handleExpandRow = (patientId, tab) => {
    console.log('handleExpandRow called with patientId:', patientId, 'tab:', tab);
    if (expandedPatient === patientId && expandedTab === tab) {
      setExpandedPatient(null);
      setExpandedTab(null);
      setAppointmentsSubTab('past');
    } else {
      setExpandedPatient(patientId);
      setExpandedTab(tab);
      setAppointmentsSubTab('past');
      if (tab === 'appointments') {
        console.log('Calling fetchAppointments with:', patientId);
        fetchAppointments(patientId);
      } else if (tab === 'labResults') {
        console.log('Calling fetchLabResults with:', patientId);
        fetchLabResults(patientId);
      }
    }
  };

  const getPastAppointments = (patientId) => {
    const now = new Date();
    const key = String(patientId);
    const allApts = appointments[key] || [];

    const past = allApts.filter(apt => {
      try {
        const [day, month, year] = apt.date.split('.');
        const aptDateTime = new Date(year, month - 1, day);

        if (apt.time) {
          const [hours, minutes] = apt.time.split(':');
          aptDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        }

        return aptDateTime < now;
      } catch (e) {
        console.error('Error parsing appointment:', apt, e);
        return false;
      }
    });

    return past;
  };

  const getUpcomingAppointments = (patientId) => {
    const now = new Date();
    const key = String(patientId);
    const allApts = appointments[key] || [];

    const upcoming = allApts.filter(apt => {
      try {
        const [day, month, year] = apt.date.split('.');
        const aptDateTime = new Date(year, month - 1, day);

        if (apt.time) {
          const [hours, minutes] = apt.time.split(':');
          aptDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        }

        return aptDateTime >= now;
      } catch (e) {
        console.error('Error parsing appointment:', apt, e);
        return false;
      }
    });

    return upcoming;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Aranıyor...</p></div>;

  const noSearchPerformed = patients.length === 0 && !error && !searchError && !searchQuery;

  // Key consistent usage: patient.patientId if it exists, else patient.id
  const getPatientIdentifier = (patient) => patient.patientId || patient.id;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Hastalar</h1>
          <p className="page-subtitle">Kayıtlı tüm hastaları görüntüleyin</p>
        </div>
      </div>

      <div className="patients-filters">
        <div className="filters-header">
          <div className="filter-buttons">
            <button
              onClick={fetchAllPatients}
              className={`btn-show-all ${viewMode === 'all' ? 'active' : ''}`}
            >
              📋 Tüm Hastaları Göster
            </button>
            <button
              onClick={() => {
                setViewMode('search');
                setPatients([]);
                setSearchQuery('');
              }}
              className={`btn-search-tckn ${viewMode === 'search' ? 'active' : ''}`}
            >
              🔍 TCKN ile Ara
            </button>
          </div>
          {viewMode === 'all' && patients.length > 0 && (
            <div className="patient-count">
              Toplam Hasta: <strong>{patients.length}</strong>
            </div>
          )}
        </div>

        {viewMode === 'search' && (
          <>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="TC numarası ile hastayı arayın"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  maxLength="11"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-search-submit"
              >
                {loading ? 'Aranıyor...' : 'Ara'}
              </button>
            </form>

            {(error || searchError) && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error || searchError}
              </div>
            )}
          </>
        )}
        {error && viewMode === 'all' && (
          <div className="error-message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
      </div>

      <div className="table-container">
        {noSearchPerformed ? (
          <div className="empty-search-state">
            <p className="icon">🔍 Hastayı Arayın</p>
            <p className="hint">Yukarıdaki arama kutusunda TC numarası girerek bir hastayı arayınız.</p>
            <p className="example">Örnek: 12345678901</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>TCKN</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Doğum Tarihi</th>
                <th style={{ width: '80px', textAlign: 'center' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan="6" className="no-data">Sonuç bulunamadı</td></tr>
              ) : (
                patients.map(patient => {
                  const patientIdentifier = getPatientIdentifier(patient);
                  return (
                    <React.Fragment key={patient.id}>
                      <tr>
                        <td>
                          <div className="name-cell">
                            <div className="avatar">
                              {patient.firstName?.charAt(0)}
                              {patient.lastName?.charAt(0)}
                            </div>
                            <span>{patient.firstName} {patient.lastName}</span>
                          </div>
                        </td>
                        <td>{patient.tckn}</td>
                        <td>{patient.email || '-'}</td>
                        <td>{patient.phoneNumber || '-'}</td>
                        <td>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('tr-TR') : '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="action-buttons">
                            {viewMode === 'search' && (
                              <>
                                <button
                                  className={`btn-appointments ${expandedPatient === patientIdentifier && expandedTab === 'appointments' ? 'active' : ''}`}
                                  onClick={() => handleExpandRow(patientIdentifier, 'appointments')}
                                  title="Randevuları göster"
                                >
                                  📅
                                </button>
                                <button
                                  className={`btn-lab ${expandedPatient === patientIdentifier && expandedTab === 'labResults' ? 'active' : ''}`}
                                  onClick={() => handleExpandRow(patientIdentifier, 'labResults')}
                                  title="Lab sonuçlarını göster"
                                >
                                  🔬
                                </button>
                              </>
                            )}
                            {viewMode === 'all' && user?.role === 'ADMIN' && (
                              <button
                                className="btn-delete-patient"
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setShowDeleteConfirm(true);
                                }}
                                title="Hastayı sil"
                              >
                                🗑️ Sil
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Appointments Row */}
                      {expandedPatient === patientIdentifier && expandedTab === 'appointments' && (
                        <tr className="expanded-row">
                          <td colSpan="6" className="expanded-row-container">
                            <div className="expanded-content">
                              <h3>Randevular</h3>

                              <div className="expanded-tabs">
                                <button
                                  onClick={() => setAppointmentsSubTab('past')}
                                  className={`tab-btn ${appointmentsSubTab === 'past' ? 'active past' : ''}`}
                                >
                                  Geçmiş Randevular
                                </button>
                                <button
                                  onClick={() => setAppointmentsSubTab('upcoming')}
                                  className={`tab-btn ${appointmentsSubTab === 'upcoming' ? 'active upcoming' : ''}`}
                                >
                                  Gelecek Randevular
                                </button>
                              </div>

                              {loadingAppointments[patientIdentifier] ? (
                                <p>Randevular yükleniyor...</p>
                              ) : appointmentsSubTab === 'past' ? (
                                getPastAppointments(patientIdentifier).length === 0 ? (
                                  <p>Geçmiş randevu bulunamadı</p>
                                ) : (
                                  <table className="nested-table">
                                    <thead>
                                      <tr>
                                        <th>Doktor</th>
                                        <th>Bölüm</th>
                                        <th>Tarih</th>
                                        <th>Saat</th>
                                        <th>Durum</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getPastAppointments(patientIdentifier).map(apt => (
                                        <tr key={apt.id}>
                                          <td>{apt.doctorName}</td>
                                          <td>{apt.department || '-'}</td>
                                          <td>{apt.date}</td>
                                          <td>{apt.time}</td>
                                          <td>
                                            <span className={`status-badge ${apt.status === 'APPROVED' ? 'status-approved' :
                                              apt.status === 'CANCELLED' ? 'status-cancelled' : 'status-pending'
                                              }`}>
                                              {apt.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )
                              ) : (
                                getUpcomingAppointments(patientIdentifier).length === 0 ? (
                                  <p>Gelecek randevu bulunamadı</p>
                                ) : (
                                  <table className="nested-table">
                                    <thead>
                                      <tr>
                                        <th>Doktor</th>
                                        <th>Bölüm</th>
                                        <th>Tarih</th>
                                        <th>Saat</th>
                                        <th>Durum</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getUpcomingAppointments(patientIdentifier).map(apt => (
                                        <tr key={apt.id}>
                                          <td>{apt.doctorName}</td>
                                          <td>{apt.department || '-'}</td>
                                          <td>{apt.date}</td>
                                          <td>{apt.time}</td>
                                          <td>
                                            <span className={`status-badge ${apt.status === 'APPROVED' ? 'status-approved' :
                                              apt.status === 'CANCELLED' ? 'status-cancelled' : 'status-pending'
                                              }`}>
                                              {apt.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* Expanded Lab Results Row */}
                      {expandedPatient === patientIdentifier && expandedTab === 'labResults' && (
                        <tr className="expanded-row">
                          <td colSpan="6" className="expanded-row-container">
                            <div className="expanded-content">
                              <h3 className="lab-results-title">Lab Sonuçları</h3>
                              {loadingLabResults[patientIdentifier] ? (
                                <p style={{ color: '#64748b' }}>Yükleniyor...</p>
                              ) : !labResults[patientIdentifier] || labResults[patientIdentifier].length === 0 ? (
                                <p style={{ color: '#94a3b8' }}>Bu hasta için lab sonucu bulunamadı.</p>
                              ) : (
                                <table className="lab-results-table">
                                  <thead>
                                    <tr>
                                      <th>Dosya Adı</th>
                                      <th>Açıklama</th>
                                      <th>Yükleyen</th>
                                      <th>Tarih</th>
                                      <th>Durum</th>
                                      <th style={{ textAlign: 'center' }}>İşlem</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {labResults[patientIdentifier].map((file) => (
                                      <tr key={file.id}>
                                        <td>{file.fileName}</td>
                                        <td>{file.description || '-'}</td>
                                        <td>
                                          {file.laborant ? `${file.laborant.firstName} ${file.laborant.lastName}` : '-'}
                                        </td>
                                        <td>
                                          {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('tr-TR') : '-'}
                                        </td>
                                        <td>
                                          <span style={{
                                            background: file.request?.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                            color: file.request?.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 600
                                          }}>
                                            {file.request?.status === 'COMPLETED' ? '✓ Tamamlandı' : 'Beklemede'}
                                          </span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                          <button
                                            onClick={() => handleDownloadFile(file.id, file.fileName)}
                                            className="btn-download"
                                          >
                                            İndir
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">⚠️ Hastayı Sil</h3>
            <p className="modal-text">
              <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong>'ı silmek istediğinize emin misiniz?
              <br />Bu işlem geri alınamaz ve tüm verileri silecektir.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedPatient(null);
                }}
                className="btn-cancel"
              >
                İptal
              </button>
              <button
                onClick={handleDeletePatient}
                className="btn-confirm-delete"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
