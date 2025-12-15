import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function PatientsPage() {
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
  const token = localStorage.getItem('personnelToken');

  useEffect(() => {
    // No initial fetch needed - search by TCKN only
  }, []);

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
      // Use patientId (from Patient table) not user.id
      const url = `${BaseURL}/appointments?list=true&patientId=${patientId}`;
      console.log('Fetching from URL:', url);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Appointments fetched for patient', patientId, ':', res.data?.data);
      // Store with patientId as key (will be whatever type it is)
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
    // Convert patientId to string for consistency
    const key = String(patientId);
    const allApts = appointments[key] || [];
    console.log('Getting past appointments for patientId:', patientId, 'key:', key);
    console.log('appointments object keys:', Object.keys(appointments));
    console.log('appointments[key]:', appointments[key]);
    console.log('All appointments:', allApts);

    const past = allApts.filter(apt => {
      try {
        // Parse date from DD.MM.YYYY format
        const [day, month, year] = apt.date.split('.');
        const aptDateTime = new Date(year, month - 1, day);

        // Parse time if available
        if (apt.time) {
          const [hours, minutes] = apt.time.split(':');
          aptDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        }

        const isPast = aptDateTime < now;
        console.log(`Apt ${apt.date} ${apt.time}: ${aptDateTime} < ${now} = ${isPast}`);
        return isPast;
      } catch (e) {
        console.error('Error parsing appointment:', apt, e);
        return false;
      }
    });

    console.log('Past appointments filtered:', past.length);
    return past;
  };

  const getUpcomingAppointments = (patientId) => {
    const now = new Date();
    // Convert patientId to string for consistency
    const key = String(patientId);
    const allApts = appointments[key] || [];
    console.log('Getting upcoming appointments for patientId:', patientId, 'key:', key);

    const upcoming = allApts.filter(apt => {
      try {
        // Parse date from DD.MM.YYYY format
        const [day, month, year] = apt.date.split('.');
        const aptDateTime = new Date(year, month - 1, day);

        // Parse time if available
        if (apt.time) {
          const [hours, minutes] = apt.time.split(':');
          aptDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        }

        const isUpcoming = aptDateTime >= now;
        return isUpcoming;
      } catch (e) {
        console.error('Error parsing appointment:', apt, e);
        return false;
      }
    });

    console.log('Upcoming appointments filtered:', upcoming.length);
    return upcoming;
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Aranıyor...</p></div>;

  // Show empty state message when no search has been performed
  const noSearchPerformed = patients.length === 0 && !error && !searchError && !searchQuery;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">View all registered patients</p>
        </div>
      </div>

      <div className="filters-section" style={{ marginBottom: '24px' }}>
        <form
          onSubmit={handleSearch}
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center', /* Dikeyde ortalar */
            flexWrap: 'nowrap',
            width: '100%'
          }}
        >

          {/* SOL: ARAMA KUTUSU */}
          <div className="search-box" style={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '16px',
            padding: '0 20px',
            height: '56px',           /* KİLİT NOKTA 1: Yükseklik */
            boxSizing: 'border-box',  /* KİLİT NOKTA 2: Border yüksekliğe dahil olsun */
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            minWidth: '0',
            transition: 'all 0.2s ease'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ minWidth: '22px' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="TC numarası ile hastayı arayın"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              maxLength="11"
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                marginLeft: '12px',
                fontSize: '16px',
                color: '#334155',
                background: 'transparent',
                height: '100%',
                padding: 0, /* Inputun kendi padding'ini sıfırladık */
                margin: 0   /* Inputun kendi margin'ini sıfırladık */
              }}
            />
          </div>

          {/* SAĞ: BUTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: '0 0 auto',
              height: '56px',          /* KİLİT NOKTA 3: Input ile BİREBİR aynı yükseklik */
              padding: '0 40px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              letterSpacing: '0.5px',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgba(33, 150, 243, 0.3)',
              margin: 0,              /* KİLİT NOKTA 4: Olası kaymaları engeller */
              display: 'flex',        /* KİLİT NOKTA 5: Yazıyı tam ortalamak için */
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box' /* KİLİT NOKTA 6: Hesaplama hatasını önler */
            }}
          >
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </form>

        {/* Hata mesajları kısmı aynı kalabilir */}
        {(error || searchError) && (
          <div style={{ color: '#ef4444', marginTop: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error || searchError}
          </div>
        )}
      </div>

      <div className="table-container">
        {noSearchPerformed ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#94a3b8',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '2px dashed #cbd5e1'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>🔍 Hastayı Arayın</p>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>Yukarıdaki arama kutusunda TC numarası girerek bir hastayı arayınız.</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Örnek: 12345678901
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>TCKN</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr><td colSpan="6" className="no-data">Sonuç bulunamadı</td></tr>
              ) : (
                patients.map(patient => (
                  <React.Fragment key={patient.id}>
                    <tr>
                      <td>
                        <div className="name-cell">
                          <div className="avatar">{patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}</div>
                          <span>{patient.firstName} {patient.lastName}</span>
                        </div>
                      </td>
                      <td>{patient.tckn}</td>
                      <td>{patient.email || '-'}</td>
                      <td>{patient.phoneNumber || '-'}</td>
                      <td>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('tr-TR') : '-'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                          <button
                            className="expand-btn"
                            onClick={() => handleExpandRow(patient.patientId, 'appointments')}
                            title="Show past appointments"
                            style={{
                              background: expandedPatient === patient.patientId && expandedTab === 'appointments' ? '#4CAF50' : '#2196F3',
                              color: 'white',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            ▼
                          </button>
                          <button
                            className="expand-btn"
                            onClick={() => handleExpandRow(patient.patientId, 'labResults')}
                            title="Show lab results"
                            style={{
                              background: expandedPatient === patient.patientId && expandedTab === 'labResults' ? '#FF9800' : '#9C27B0',
                              color: 'white',
                              border: 'none',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Appointments Row */}
                    {expandedPatient === patient.patientId && expandedTab === 'appointments' && (
                      <tr className="expanded-row">
                        <td colSpan="6" style={{ padding: '20px' }}>
                          <div className="expanded-content">
                            <h3>Randevular</h3>

                            {/* Tabs for Past and Upcoming */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', borderBottom: '2px solid #e9ecef' }}>
                              <button
                                onClick={() => setAppointmentsSubTab('past')}
                                style={{
                                  padding: '10px 15px',
                                  background: appointmentsSubTab === 'past' ? '#2196F3' : '#e9ecef',
                                  color: appointmentsSubTab === 'past' ? 'white' : '#495057',
                                  border: 'none',
                                  borderRadius: '4px 4px 0 0',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: '14px'
                                }}
                              >
                                Geçmiş Randevular
                              </button>
                              <button
                                onClick={() => setAppointmentsSubTab('upcoming')}
                                style={{
                                  padding: '10px 15px',
                                  background: appointmentsSubTab === 'upcoming' ? '#4CAF50' : '#e9ecef',
                                  color: appointmentsSubTab === 'upcoming' ? 'white' : '#495057',
                                  border: 'none',
                                  borderRadius: '4px 4px 0 0',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  fontSize: '14px'
                                }}
                              >
                                Gelecek Randevular
                              </button>
                            </div>

                            {loadingAppointments[patient.id] ? (
                              <p>Randevular yükleniyor...</p>
                            ) : appointmentsSubTab === 'past' ? (
                              // Past Appointments
                              getPastAppointments(expandedPatient).length === 0 ? (
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
                                    {getPastAppointments(expandedPatient).map(apt => (
                                      <tr key={apt.id}>
                                        <td>{apt.doctorName}</td>
                                        <td>{apt.department || '-'}</td>
                                        <td>{apt.date}</td>
                                        <td>{apt.time}</td>
                                        <td>
                                          <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            background: apt.status === 'APPROVED' ? '#4CAF50' :
                                              apt.status === 'CANCELLED' ? '#f44336' : '#FFC107',
                                            color: 'white'
                                          }}>
                                            {apt.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )
                            ) : (
                              // Upcoming Appointments
                              getUpcomingAppointments(expandedPatient).length === 0 ? (
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
                                    {getUpcomingAppointments(expandedPatient).map(apt => (
                                      <tr key={apt.id}>
                                        <td>{apt.doctorName}</td>
                                        <td>{apt.department || '-'}</td>
                                        <td>{apt.date}</td>
                                        <td>{apt.time}</td>
                                        <td>
                                          <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            background: apt.status === 'APPROVED' ? '#4CAF50' :
                                              apt.status === 'CANCELLED' ? '#f44336' : '#FFC107',
                                            color: 'white'
                                          }}>
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
                    {expandedPatient === patient.patientId && expandedTab === 'labResults' && (
                      <tr className="expanded-row">
                        <td colSpan="6" style={{ padding: '20px' }}>
                          <div className="expanded-content">
                            <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>Lab Sonuçları</h3>
                            {loadingLabResults[patient.patientId] ? (
                              <p style={{ color: '#64748b' }}>Yükleniyor...</p>
                            ) : !labResults[patient.patientId] || labResults[patient.patientId].length === 0 ? (
                              <p style={{ color: '#94a3b8' }}>Bu hasta için lab sonucu bulunamadı.</p>
                            ) : (
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Dosya Adı</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Açıklama</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Yükleyen</th>
                                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Tarih</th>
                                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>İşlem</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {labResults[patient.patientId].map((file) => (
                                    <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                      <td style={{ padding: '12px', color: '#334155' }}>{file.fileName}</td>
                                      <td style={{ padding: '12px', color: '#64748b' }}>{file.description || '-'}</td>
                                      <td style={{ padding: '12px', color: '#64748b' }}>
                                        {file.laborant ? `${file.laborant.firstName} ${file.laborant.lastName}` : '-'}
                                      </td>
                                      <td style={{ padding: '12px', color: '#64748b' }}>
                                        {new Date(file.uploadedAt).toLocaleDateString('tr-TR')}
                                      </td>
                                      <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <button
                                          onClick={() => handleDownloadFile(file.id, file.fileName)}
                                          style={{
                                            padding: '6px 12px',
                                            background: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '500'
                                          }}
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
