import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './SharedDashboard.css';

export default function PatientDashboard() {
  const { t, i18n } = useTranslation('dashboard');
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
  const BaseURL = `${API_BASE}/api/v1`;

  const { user, updateUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  // URL'e göre başlangıç sekmesi
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/profile')) return 'settings';
    return 'appointments';
  });

  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [labRequests, setLabRequests] = useState([]);
  // timeFilter: all, future, past, cancelled
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // Sıralama kriteri: 'date' veya 'doctor'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal ve Form State'leri
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [review, setReview] = useState({ rating: 0 }); // Default to 0 for selection
  const [hoverRating, setHoverRating] = useState(0); // State for hover preview

  const [profileData, setProfileData] = useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    dateOfBirth: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Kullanıcı verisi gelince state'i doldur
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        bloodType: user.bloodType || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
      });

      fetchAppointments();
      fetchLabResults();
      fetchLabRequests();
    }
  }, [user]);

  // Sekme yönetimi
  useEffect(() => {
    if (location.pathname.includes('/profile')) {
      setActiveTab('settings');
    } else if (location.pathname.includes('/my-appointments')) {
      setActiveTab('appointments');
    }
  }, [location.pathname]);

  // --- API İSTEKLERİ ---

  // Randevu İptal Etme
  const handleCancelAppointment = async (appointmentId) => {
    // Modern onay modalı
    const confirmCancel = window.confirm(
      t('messages.cancelConfirmText', {
        defaultValue: '⚠️ Randevu İptali\n\n' +
          'Bu randevuyu iptal etmek istediğinize emin misiniz?\n\n' +
          '• İptal edilen randevular geri alınamaz\n' +
          '• Yeni randevu için tekrar başvuru yapmanız gerekir\n\n' +
          'Devam etmek istiyor musunuz?'
      })
    );

    if (!confirmCancel) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      await axios.put(`${BaseURL}/appointments/${appointmentId}/status`, { status: 'CANCELLED' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: t('messages.cancelSuccess') });
      fetchAppointments();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || t('messages.cancelError') });
    } finally {
      setLoading(false);
    }
  };

  // Randevu Değerlendirme Modal Açma
  const openReviewModal = (appointment) => {
    setSelectedAppointment(appointment);
    setReview({ rating: 0 });
    setHoverRating(0);
    setShowReviewModal(true);
  };

  // Değerlendirme Gönderme
  const handleSubmitReview = async () => {
    if (!selectedAppointment) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      await axios.post(
        `${BaseURL}/appointments/${selectedAppointment.id}/rate`,
        { rating: review.rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: t('messages.reviewSuccess') });

      // Randevuları yeniden çek ve modalı kapat
      await fetchAppointments();

      setTimeout(() => {
        setShowReviewModal(false);
        setSelectedAppointment(null);
        setReview({ rating: 5 });
        setMessage({ type: '', text: '' });
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || t('messages.reviewError') });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      if (!token) throw new Error(t('messages.errorOccurred'));
      const patientId = user?.profileId || user?.patientId || user?.id;
      if (!patientId) throw new Error(t('messages.errorOccurred'));

      console.log('🔍 User object:', user); // User object'ini logla
      console.log('🔍 Patient ID:', patientId); // Patient ID'yi logla

      // Doğru endpoint: /appointments?list=true&patientId=...
      const url = `${BaseURL}/appointments?list=true&patientId=${patientId}`;
      console.log('📡 Request URL:', url); // URL'yi logla

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📡 Response:', response); // Tüm response'u logla
      const data = response.data.data || response.data;
      console.log('📋 Randevular:', data); // Rating field kontrol için
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Randevular alınamadı:', error);
      console.error('Error details:', error.response?.data || error.message); // Error detaylarını logla
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabResults = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      if (!token) throw new Error(t('messages.errorOccurred'));

      console.log('Fetching my lab results...');
      console.log('🔍 Lab Results - User:', user);
      console.log('🔍 Lab Results - Token:', token.substring(0, 20) + '...');

      // Yeni /my endpoint'i kullan - token'dan userId alınır
      const response = await axios.get(`${BaseURL}/medical-files/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Lab results response:', response.data);
      const data = response.data.data || response.data;
      setLabResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Tahlil sonuçları alınamadı:', error);
      console.error('Error response:', error.response?.data);
      setLabResults([]);
    }
  };

  // Fetch lab requests for patient
  const fetchLabRequests = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      console.log('Fetching my lab requests...');

      const response = await axios.get(`${BaseURL}/lab-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Lab requests response:', response.data);
      const data = response.data.data || response.data;
      setLabRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lab talepleri alınamadı:', error);
      setLabRequests([]);
    }
  };

  // Dosya indirme fonksiyonu
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      if (!fileId) {
        setMessage({ type: 'error', text: t('messages.fileIdNotFound') });
        return;
      }

      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      const fullUrl = `${BaseURL}/medical-files/${fileId}/download`;

      console.log('Downloading from:', fullUrl);

      // Fetch ile indir
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Dosya indirilemedi');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'dosya';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Dosya indirme hatası:', error);
      setMessage({ type: 'error', text: t('messages.fileDownloadError') });
    }
  };

  // --- FORM İŞLEMLERİ ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');

      // Backend'in kabul ettiği alanları gönder - sadece dolu olanları!
      const payload = {};

      // User tablosu alanları - sadece dolu olanları gönder
      if (profileData.email?.trim()) payload.email = profileData.email.trim();
      if (profileData.phoneNumber?.trim()) payload.phoneNumber = profileData.phoneNumber.trim();

      // Patient tablosu alanları - sadece dolu olanları gönder
      if (profileData.address?.trim()) payload.address = profileData.address.trim();
      if (profileData.emergencyContact?.trim()) payload.emergencyContact = profileData.emergencyContact.trim();
      if (profileData.bloodType?.trim()) payload.bloodType = profileData.bloodType.trim();

      // dateOfBirth - sadece doluysa gönder, YYYY-MM-DD formatında
      if (profileData.dateOfBirth?.trim()) {
        payload.dateOfBirth = profileData.dateOfBirth;
      }

      // En az bir alan doluysa gönder
      if (Object.keys(payload).length === 0) {
        setMessage({ type: 'error', text: t('messages.noFieldToUpdate') });
        setLoading(false);
        return;
      }

      console.log('📤 Profil güncelleme payload:', JSON.stringify(payload, null, 2));

      const response = await axios.put(`${BaseURL}/patients/me/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Context'i güncelle
      updateUser(payload);

      setMessage({ type: 'success', text: response.data?.message || t('messages.profileUpdateSuccess') });
    } catch (error) {
      console.error('❌ Profil güncelleme hatası:', error.response?.data);
      const errorMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || t('messages.errorOccurred');
      setMessage({ type: 'error', text: t('messages.profileUpdateError') + ': ' + errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t('messages.passwordMismatch') });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('messages.passwordLength') });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      const response = await axios.put(`${BaseURL}/patients/me/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: response.data?.message || t('messages.passwordSuccess') });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || t('messages.passwordError') });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (labResult) => {
    alert(t('messages.demoDownload', { testName: labResult.testName }));
  };

  // Randevuları filtreleme ve sıralama
  const filteredAppointments = appointments
    .filter(apt => {
      const dateStr = apt.date || apt.startTime || apt.createdAt;
      let aptDate = new Date();
      if (dateStr && dateStr.includes('.')) {
        const parts = dateStr.split('.');
        aptDate = new Date(parts[2], parts[1] - 1, parts[0]);
      } else if (dateStr) {
        aptDate = new Date(dateStr);
      }
      const now = new Date();
      if (timeFilter === 'past') return apt.status !== 'CANCELLED' && aptDate < now;
      if (timeFilter === 'future') return apt.status !== 'CANCELLED' && aptDate >= now;
      if (timeFilter === 'cancelled') return apt.status === 'CANCELLED';
      if (timeFilter === 'done') return apt.status === 'DONE';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'doctor') {
        const nameA = (a.doctorName || (a.doctor ? `${a.doctor.firstName} ${a.doctor.lastName}` : '') || '').toLowerCase();
        const nameB = (b.doctorName || (b.doctor ? `${b.doctor.firstName} ${b.doctor.lastName}` : '') || '').toLowerCase();
        return nameA.localeCompare(nameB);
      } else {
        const dateA = new Date(a.date || a.startTime || a.createdAt);
        const dateB = new Date(b.date || b.startTime || b.createdAt);
        return dateA - dateB;
      }
    });

  if (!user) return <div className="dashboard-loading"><div className="spinner"></div><p>{t('appointments.loading')}</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '5px' }}>
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>{t('title')}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn-header">
          <svg className="exit-icon" viewBox="0 0 640 640" fill="currentColor">
            <path d="M224 160C241.7 160 256 145.7 256 128C256 110.3 241.7 96 224 96L160 96C107 96 64 139 64 192L64 448C64 501 107 544 160 544L224 544C241.7 544 256 529.7 256 512C256 494.3 241.7 480 224 480L160 480C142.3 480 128 465.7 128 448L128 192C128 174.3 142.3 160 160 160L224 160zM566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L438.6 169.3C426.1 156.8 405.8 156.8 393.3 169.3C380.8 181.8 380.8 202.1 393.3 214.6L466.7 288L256 288C238.3 288 224 302.3 224 320C224 337.7 238.3 352 256 352L466.7 352L393.3 425.4C380.8 437.9 380.8 458.2 393.3 470.7C405.8 483.2 426.1 483.2 438.6 470.7L566.6 342.7z" />
          </svg>
          <span>{t('logout')}</span>
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}
          style={{
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

      {/* SEKMELER */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          <img src="/appointment.svg" alt="" className="tab-icon" />
          <span>{t('tabs.appointments')}</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'lab-results' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab-results')}
        >
          <img src="/lab2.svg" alt="" className="tab-icon" />
          <span>{t('tabs.labResults')}</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'lab-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab-requests')}
        >
          <img src="/request1.svg" alt="" className="tab-icon" />
          <span>{t('tabs.labRequests')} ({labRequests.length})</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <img src="/star.svg" alt="" className="tab-icon" />
          <span>{t('tabs.reviews')}</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <img src="/setting1.svg" alt="" className="tab-icon" />
          <span>{t('tabs.settings')}</span>
        </button>
      </div>

      {/* 1. RANDEVULAR SEKMESİ */}
      {activeTab === 'appointments' && (
        <>
          <div className="filters-bar">
            <div className="filter-group">
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="all">{t('filters.all')}</option>
                <option value="future">{t('filters.future')}</option>
                <option value="past">{t('filters.past')}</option>
                <option value="done">{t('filters.done')}</option>
                <option value="cancelled">{t('filters.cancelled')}</option>
              </select>
            </div>
            <div className="filter-group">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date">{t('filters.sortByDate')}</option>
                <option value="doctor">{t('filters.sortByDoctor')}</option>
              </select>
            </div>
          </div>

          <div className="appointments-grid modern-appointments-grid">
            {loading ? (
              <p>{t('appointments.loading')}</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="no-data">{t('appointments.noData')}</p>
            ) : (
              filteredAppointments.map((apt) => {
                const doctorName = apt.doctorName || (apt.doctor ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : t('appointments.notSpecified'));
                const department = apt.departmentName || (apt.department && apt.department.name) || t('appointments.general');
                const dateStr = apt.date || (apt.startTime && new Date(apt.startTime).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'tr-TR'));
                const timeStr = apt.time || (apt.startTime && new Date(apt.startTime).toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'tr-TR', { hour: '2-digit', minute: '2-digit' }));
                const status = apt.status || 'APPROVED';
                // Avatar için ilk harfler
                const avatar = doctorName.split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase();
                // Renkli durum badge'i
                const statusColors = {
                  'COMPLETED': '#22c55e',
                  'DONE': '#22c55e',
                  'CANCELLED': '#ef4444',
                  'APPROVED': '#2563eb',
                  'DEFAULT': '#64748b'
                };
                const statusLabels = {
                  'DONE': t('appointments.completed'),
                  'CANCELLED': t('appointments.cancelled'),
                  'APPROVED': t('appointments.approved')
                };
                const badgeColor = statusColors[status] || statusColors['DEFAULT'];
                const statusLabel = statusLabels[status] || status;
                return (
                  <div key={apt.id} className="appointment-card modern-appointment-card"
                    style={{ border: `1.5px solid ${badgeColor}22` }}>
                    {/* HEADER: Avatar + İsim + Bölüm */}
                    <div className="modern-apt-header">
                      <div className="doctor-avatar" title={doctorName}>{avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div className="doctor-info-name">{doctorName}</div>
                        <div className="doctor-info-dept">{department}</div>
                      </div>
                    </div>

                    {/* Ayırıcı Çizgi */}
                    <div style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }}></div>

                    {/* BODY: Tarih ve Saat */}
                    <div style={{ color: 'var(--dash-text)' }}>
                      <div><strong>{t('appointments.date')}:</strong> {dateStr}</div>
                      <div><strong>{t('appointments.time')}:</strong> {timeStr}</div>
                    </div>

                    {/* Ayırıcı Çizgi */}
                    <div style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }}></div>

                    {/* FOOTER: Solda Durum Badge + Sağda Butonlar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      {/* Sol: Durum Badge */}
                      <span className="modern-badge" style={{ background: badgeColor + '22', color: badgeColor, padding: '6px 14px', borderRadius: 12, fontWeight: 600, fontSize: 13 }} title={status}>{statusLabel}</span>

                      {/* Sağ: Butonlar */}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        {/* İptal butonu */}
                        {status !== 'CANCELLED' && status !== 'COMPLETED' && status !== 'DONE' && (() => {
                          let aptDate = new Date();
                          if (apt.date && apt.date.includes('.')) {
                            const parts = apt.date.split('.');
                            aptDate = new Date(parts[2], parts[1] - 1, parts[0]);
                          } else if (apt.date) {
                            aptDate = new Date(apt.date);
                          } else if (apt.startTime) {
                            aptDate = new Date(apt.startTime);
                          }
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          aptDate.setHours(0, 0, 0, 0);
                          if (aptDate >= today) {
                            return (
                              <button className="btn-danger-action modern-btn" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px', fontWeight: 600, fontSize: '13px', height: '32px', marginTop: 0, width: 'auto' }} onClick={() => handleCancelAppointment(apt.id)}>
                                {t('appointments.cancel')}
                              </button>
                            );
                          }
                          return null;
                        })()}
                        {/* Değerlendir butonu - Sadece DONE ve henüz değerlendirilmemiş randevular için */}
                        {status === 'DONE' && !apt.rating && (
                          <button
                            className="btn-primary modern-btn"
                            style={{
                              background: 'none',
                              color: '#e99f00ff',
                              borderRadius: 100,
                              border: '1px solid #d8b100ff',
                              boxShadow: 'none',
                              padding: '4px 14px',
                              fontWeight: 700,
                              fontSize: '13px',
                              height: '32px',
                              width: 'auto'
                            }}
                            onClick={() => openReviewModal(apt)}
                          >
                            {t('appointments.rate')}
                          </button>
                        )}
                        {/* Puan göstergesi - Değerlendirilmiş randevular için */}
                        {apt.rating && (
                          <div className="review-indicator" style={{ padding: '4px 14px', height: '32px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>
                            ⭐ {apt.rating}/5
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* 2. TAHLİL SONUÇLARI SEKMESİ */}
      {activeTab === 'lab-results' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('labResults.testName')}</th>
                <th>{t('labResults.date')}</th>
                <th>{t('labResults.uploadedBy')}</th>
                <th>{t('labResults.fileType')}</th>
                <th>{t('labResults.size')}</th>
                <th>{t('labResults.action')}</th>
              </tr>
            </thead>
            <tbody>
              {labResults.length === 0 ? (
                <tr><td colSpan="6" className="no-data">{t('labResults.noData')}</td></tr>
              ) : (
                labResults.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <strong>{result.testName}</strong>
                      {result.description && <div style={{ fontSize: '12px', color: '#666' }}>{result.description}</div>}
                    </td>
                    <td>{new Date(result.testDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'tr-TR')}</td>
                    <td>{result.laborant?.user?.firstName} {result.laborant?.user?.lastName}</td>
                    <td>
                      <span className="badge" style={{
                        background: result.fileType?.includes('pdf') ? '#fee2e2' : '#dbeafe',
                        color: result.fileType?.includes('pdf') ? '#991b1b' : '#1e40af'
                      }}>
                        {result.fileType?.includes('pdf') ? t('labResults.pdf') : t('labResults.image')}
                      </span>
                    </td>
                    <td>{result.fileSizeKB?.toFixed(0)} KB</td>
                    <td>
                      <button
                        className="btn-sm btn-secondary"
                        onClick={() => handleDownloadFile(result.id, result.fileName)}
                      >
                        {t('labResults.download')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. LAB TALEPLERİ SEKMESİ */}
      {activeTab === 'lab-requests' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('labRequests.title')}</th>
                <th>{t('labRequests.doctor')}</th>
                <th>{t('labRequests.date')}</th>
                <th>{t('labRequests.laborant')}</th>
                <th>{t('labRequests.status')}</th>
                <th>{t('labRequests.details')}</th>
              </tr>
            </thead>
            <tbody>
              {labRequests.length === 0 ? (
                <tr><td colSpan="6" className="no-data">{t('labRequests.noData')}</td></tr>
              ) : (
                labRequests.map((request) => {
                  const statusLabel = {
                    'PENDING': t('labRequests.pending'),
                    'ASSIGNED': t('labRequests.assigned'),
                    'COMPLETED': t('appointments.completed'),
                    'CANCELED': t('appointments.cancelled')
                  }[request.status] || request.status;

                  const statusColor = {
                    'PENDING': { bg: '#fef3c7', color: '#92400e' },
                    'ASSIGNED': { bg: '#dbeafe', color: '#0c4a6e' },
                    'COMPLETED': { bg: '#dcfce7', color: '#166534' },
                    'CANCELED': { bg: '#fee2e2', color: '#991b1b' }
                  }[request.status] || { bg: '#f3f4f6', color: '#374151' };

                  return (
                    <tr key={request.id}>
                      <td>
                        <strong>{request.fileTitle}</strong>
                        {request.notes && <div style={{ fontSize: '12px', color: '#666' }}>{request.notes}</div>}
                      </td>
                      <td>{request.createdByUser?.firstName} {request.createdByUser?.lastName}</td>
                      <td>{new Date(request.requestedAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'tr-TR')}</td>
                      <td>
                        {request.assigneeLaborant ? (
                          <span style={{ fontWeight: 600, color: '#059669' }}>
                            ✓ {request.assigneeLaborant.user.firstName} {request.assigneeLaborant.user.lastName}
                          </span>
                        ) : (
                          <span style={{ color: '#666' }}>{t('labRequests.notAssigned')}</span>
                        )}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: statusColor.bg,
                            color: statusColor.color,
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontWeight: 600,
                            fontSize: '12px'
                          }}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td>
                        {request.medicalFile && (
                          <span
                            style={{
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            📄 {request.medicalFile.testName}
                          </span>
                        )}
                        {!request.medicalFile && request.status !== 'CANCELED' && (
                          <span style={{ color: '#999', fontSize: '12px' }}>{t('labRequests.waiting')}</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. DEĞERLENDİRMELER SEKMESİ */}
      {activeTab === 'reviews' && (
        <div className="reviews-container">
          {appointments.filter(apt => apt.rating).length === 0 ? (
            <p className="no-data">{t('reviews.noData')}</p>
          ) : (
            appointments.filter(apt => apt.rating).map((apt) => (
              <div key={apt.id} className="review-card">
                <div className="review-header">
                  <div>
                    <h3 className="review-doctor-name">{apt.doctorName}</h3>
                    <p className="review-doctor-dept">{apt.department || 'Genel'}</p>
                  </div>
                  <div className="rating-stars" style={{ fontSize: '24px' }}>{'⭐'.repeat(apt.rating)}</div>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b', marginTop: '8px' }}>
                  <div><strong>📅 {t('appointments.date')}:</strong> {apt.date || (apt.ratedAt ? new Date(apt.ratedAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'tr-TR') : '')}</div>
                  <div><strong>🕐 {t('appointments.time')}:</strong> {apt.time || '-'}</div>
                  <div><strong>⭐ {t('reviews.rating')}:</strong> {apt.rating}/5</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. AYARLAR SEKMESİ */}
      {activeTab === 'settings' && (
        <div className="settings-container">
          <div className="settings-card">
            <div className="settings-header">
              <h3>{t('settings.personalInfo')}</h3>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="settings-form-group">
                  <label className="form-label">{t('settings.firstName')}</label>
                  <input type="text" className="form-input"
                    value={profileData.firstName}
                    disabled
                  />
                </div>
                <div className="settings-form-group">
                  <label className="form-label">{t('settings.lastName')}</label>
                  <input type="text" className="form-input"
                    value={profileData.lastName}
                    disabled
                  />
                </div>
              </div>

              <div className="settings-form-group">
                <label className="form-label">{t('settings.email')}</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">{t('settings.phone')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="settings-form-group">
                  <label className="form-label">{t('settings.birthDate')}</label>
                  <input
                    type="date"
                    className="form-input"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="settings-form-group">
                  <label className="form-label">{t('settings.bloodType')}</label>
                  <select
                    className="form-input"
                    value={profileData.bloodType}
                    onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                  >
                    <option value="">{t('settings.select')}</option>
                    <option value="A+">A Rh+</option>
                    <option value="A-">A Rh-</option>
                    <option value="B+">B Rh+</option>
                    <option value="B-">B Rh-</option>
                    <option value="AB+">AB Rh+</option>
                    <option value="AB-">AB Rh-</option>
                    <option value="O+">O Rh+</option>
                    <option value="O-">O Rh-</option>
                  </select>
                </div>
              </div>

              <div className="settings-form-group">
                <label className="form-label">{t('settings.address')}</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder={t('settings.addressPlaceholder')}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">{t('settings.emergencyContact')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <button type="submit" className="btn-save" style={{ background: '#2563eb', color: 'white', borderRadius: '100px' }} disabled={loading}>
                {loading ? t('appointments.loading') : t('settings.updateProfile')}
              </button>
            </form>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>{t('settings.security')}</h3>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="settings-form-group">
                <label className="form-label">{t('settings.currentPassword')}</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">{t('settings.newPassword')}</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">{t('settings.newPasswordConfirm')}</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-save btn-danger-action" style={{ background: 'white', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '100px' }} disabled={loading}>
                {loading ? t('appointments.loading') : t('settings.updatePassword')}
              </button>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('appointments.rate')}</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="appointment-info">
              <p><strong>{t('labRequests.doctor')}:</strong> {selectedAppointment.doctorName || t('labRequests.notAssigned')}</p>
              <p><strong>{t('appointments.date')}:</strong> {selectedAppointment.date} {selectedAppointment.time}</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitReview(); }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">{t('reviews.rating')} (1-5 Yıldız) *</label>
                <div
                  className="rating-input"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${star <= (hoverRating || review.rating) ? 'is-hovered' : ''} ${star <= review.rating ? 'is-selected' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => setReview({ ...review, rating: star })}
                    >
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 512 512"
                        className="star-icon-svg"
                        style={{
                          transition: 'all 0.2s',
                          fill: star <= (hoverRating || review.rating) ? '#FFD700' : '#E2E8F0',
                          transform: star <= (hoverRating || review.rating) ? 'scale(1.1)' : 'scale(1)',
                          pointerEvents: 'none',
                          boxShadow: 'none',
                          border: 'none'
                        }}
                      >
                        <path d="M393 526.27L265.48 607.008L302.863 460.798C304.117 455.892 302.437 450.708 298.535 447.478L182.345 351.138L332.965 341.505C338.02 341.181 342.43 337.974 344.297 333.271L400.004 193.001L455.715 333.271C457.586 337.974 461.996 341.181 467.047 341.505L617.647 351.134L501.467 447.466C497.576 450.692 495.885 455.88 497.139 460.79L534.522 607.01L406.992 526.276C404.855 524.921 402.422 524.245 399.992 524.245C397.555 524.241 395.125 524.921 392.984 526.269Z" transform="translate(-144 -144)" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="dash-text-muted" style={{ fontSize: '14px', marginTop: '0.5rem' }}>
                  {t('reviews.rating')}: <strong>{review.rating} / 5</strong>
                </p>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? t('appointments.loading') : t('appointments.rate')}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowReviewModal(false)}>
                  {t('appointments.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}