import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SharedDashboard.css';

export default function PatientDashboard() {
  // ✅ Vite uyumlu API adresi
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
  const BaseURL = `${API_BASE}/api/v1`;

  const { user, updateUser } = useAuth();
  const location = useLocation();

  // URL'e göre başlangıç sekmesi
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/profile')) return 'settings';
    return 'appointments';
  });

  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  // timeFilter: all, future, past, cancelled
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // Sıralama kriteri: 'date' veya 'doctor'
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal ve Form State'leri
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

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
      '⚠️ Randevu İptali\n\n' +
      'Bu randevuyu iptal etmek istediğinize emin misiniz?\n\n' +
      '• İptal edilen randevular geri alınamaz\n' +
      '• Yeni randevu için tekrar başvuru yapmanız gerekir\n\n' +
      'Devam etmek istiyor musunuz?'
    );

    if (!confirmCancel) return;

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      await axios.put(`${BaseURL}/appointments/${appointmentId}/status`, { status: 'CANCELLED' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: '✅ Randevu başarıyla iptal edildi.' });
      fetchAppointments();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Randevu iptal edilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ARTIK EN TEMİZ YÖNTEMİ KULLANIYORUZ
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      if (!token) throw new Error("Oturum anahtarı bulunamadı.");
      if (!user?.id) throw new Error("Kullanıcı ID'si bulunamadı.");

      // Doğru endpoint: /appointments?list=true&patientId=...
      const response = await axios.get(`${BaseURL}/appointments?list=true&patientId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data || response.data;
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Randevular alınamadı:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabResults = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      console.log('Fetching my lab results...');

      // Yeni /my endpoint'i kullan - token'dan userId alınır
      const response = await axios.get(`${BaseURL}/medical-files/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Lab results response:', response.data);
      const data = response.data.data || response.data;
      setLabResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Tahlil sonuçları alınamadı:', error);
      setLabResults([]);
    }
  };

  // Dosya indirme fonksiyonu
  const handleDownloadFile = async (fileId, fileName) => {
    try {
      if (!fileId) {
        setMessage({ type: 'error', text: 'Dosya Id bulunamadı' });
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
      setMessage({ type: 'error', text: 'Dosya indirilemedi' });
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
        setMessage({ type: 'error', text: 'Güncellenecek bir alan bulunamadı.' });
        setLoading(false);
        return;
      }

      console.log('📤 Profil güncelleme payload:', JSON.stringify(payload, null, 2));

      const response = await axios.put(`${BaseURL}/patients/me/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Context'i güncelle
      updateUser(payload);

      setMessage({ type: 'success', text: response.data?.message || 'Profil bilgileriniz başarıyla güncellendi.' });
    } catch (error) {
      console.error('❌ Profil güncelleme hatası:', error.response?.data);
      const errorMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || 'Hata oluştu';
      setMessage({ type: 'error', text: 'Güncelleme başarısız: ' + errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler birbiriyle uyuşmuyor.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
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

      setMessage({ type: 'success', text: response.data?.message || 'Şifreniz başarıyla değiştirildi.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Şifre değiştirilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || localStorage.getItem('patientToken');

    try {
      await axios.post(`${BaseURL}/appointments/${selectedAppointment.id}/review`, {
        rating: review.rating,
        comment: review.comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Yorumunuz başarıyla gönderildi!');
      setShowReviewModal(false);
      setSelectedAppointment(null);
      setReview({ rating: 5, comment: '' });
      fetchAppointments();
    } catch (error) {
      alert('Yorum gönderilemedi: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDownloadReport = (labResult) => {
    alert(`${labResult.testName} raporu indiriliyor... (Demo)`);
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

  if (!user) return <div className="dashboard-loading"><div className="spinner"></div><p>Yükleniyor...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '5px' }}>
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Hasta Paneli</p>
        </div>
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
          📅 Randevularım
        </button>
        <button
          className={`tab-button ${activeTab === 'lab-results' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab-results')}
        >
          🧪 Tahlil Sonuçları
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Değerlendirmelerim
        </button>
        <button
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Profil Ayarları
        </button>
      </div>

      {/* 1. RANDEVULAR SEKMESİ */}
      {activeTab === 'appointments' && (
        <>
          <div className="filters-bar">
            <div className="filter-group">
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="all">Tüm Randevular</option>
                <option value="future">Gelecek Randevular</option>
                <option value="past">Geçmiş Randevular</option>
                <option value="cancelled">İptal Edilenler</option>
              </select>
            </div>
            <div className="filter-group">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="date">Tarihe Göre Sırala</option>
                <option value="doctor">Doktor Adına Göre Sırala</option>
              </select>
            </div>
          </div>

          <div className="appointments-grid modern-appointments-grid">
            {loading ? (
              <p>Yükleniyor...</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="no-data">Kayıtlı randevu bulunamadı.</p>
            ) : (
              filteredAppointments.map((apt) => {
                const doctorName = apt.doctorName || (apt.doctor ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Doktor Belirtilmedi');
                const department = apt.departmentName || (apt.department && apt.department.name) || 'Genel';
                const dateStr = apt.date || (apt.startTime && new Date(apt.startTime).toLocaleDateString('tr-TR'));
                const timeStr = apt.time || (apt.startTime && new Date(apt.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
                const status = apt.status || 'PENDING';
                // Avatar için ilk harfler
                const avatar = doctorName.split(' ').map(s => s[0]).join('').substring(0, 2).toUpperCase();
                // Renkli durum badge'i
                const statusColors = {
                  'COMPLETED': '#22c55e',
                  'CANCELLED': '#ef4444',
                  'PENDING': '#f59e42',
                  'APPROVED': '#2563eb',
                  'WAITING': '#fbbf24',
                  'DEFAULT': '#64748b'
                };
                const badgeColor = statusColors[status] || statusColors['DEFAULT'];
                return (
                  <div key={apt.id} className={`appointment-card modern-appointment-card status-${status.toLowerCase()}`}
                    style={{ boxShadow: '0 2px 12px 0 #e0e7ef', borderRadius: 16, background: '#fff', marginBottom: 24, border: `1.5px solid ${badgeColor}22` }}>
                    <div className="modern-apt-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div className="doctor-avatar" style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 22, color: '#2563eb' }} title={doctorName}>{avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 18, color: '#222' }}>{doctorName}</div>
                        <div style={{ fontSize: 14, color: '#64748b' }}>{department}</div>
                      </div>
                      <span className="modern-badge" style={{ background: badgeColor + '22', color: badgeColor, padding: '6px 14px', borderRadius: 12, fontWeight: 600, fontSize: 14 }} title={status}>{status}</span>
                    </div>
                    <div className="modern-apt-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                      <div style={{ fontSize: 15 }}>
                        <div><strong>Tarih:</strong> {dateStr}</div>
                        <div><strong>Saat:</strong> {timeStr}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {/* İptal butonu */}
                        {status !== 'CANCELLED' && status !== 'COMPLETED' && (() => {
                          // Tarih kontrolü: sadece gelecekteki randevular iptal edilebilir
                          let aptDate = new Date();
                          if (apt.date && apt.date.includes('.')) {
                            const parts = apt.date.split('.');
                            aptDate = new Date(parts[2], parts[1] - 1, parts[0]);
                          } else if (apt.date) {
                            aptDate = new Date(apt.date);
                          } else if (apt.startTime) {
                            aptDate = new Date(apt.startTime);
                          }
                          const now = new Date();
                          if (aptDate >= now) {
                            return (
                              <button className="btn-danger-action modern-btn" style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: 8, padding: '6px 14px', fontWeight: 600 }} onClick={() => handleCancelAppointment(apt.id)}>
                                İptal Et
                              </button>
                            );
                          }
                          return null;
                        })()}
                        {/* Değerlendir butonu */}
                        {status === 'COMPLETED' && !apt.hasReview && (
                          <button className="btn-primary modern-btn" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 8, padding: '6px 14px', fontWeight: 600 }} onClick={() => { setSelectedAppointment(apt); setShowReviewModal(true); }}>
                            Değerlendir
                          </button>
                        )}
                        {/* Puan gösterge */}
                        {apt.hasReview && (
                          <div className="review-indicator" style={{ background: '#fef9c3', color: '#b45309', borderRadius: 8, padding: '6px 14px', fontWeight: 600 }}>
                            ⭐ Puanınız: {apt.reviewRating}/5
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
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Adı</th>
                <th>Tarih</th>
                <th>Yükleyen</th>
                <th>Dosya Tipi</th>
                <th>Boyut</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {labResults.length === 0 ? (
                <tr><td colSpan="6" className="no-data">Henüz tahlil sonucu bulunmuyor.</td></tr>
              ) : (
                labResults.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <strong>{result.testName}</strong>
                      {result.description && <div style={{ fontSize: '12px', color: '#666' }}>{result.description}</div>}
                    </td>
                    <td>{new Date(result.testDate).toLocaleDateString('tr-TR')}</td>
                    <td>{result.laborant?.user?.firstName} {result.laborant?.user?.lastName}</td>
                    <td>
                      <span className="badge" style={{
                        background: result.fileType?.includes('pdf') ? '#fee2e2' : '#dbeafe',
                        color: result.fileType?.includes('pdf') ? '#991b1b' : '#1e40af'
                      }}>
                        {result.fileType?.includes('pdf') ? '📄 PDF' : '🖼️ Resim'}
                      </span>
                    </td>
                    <td>{result.fileSizeKB?.toFixed(0)} KB</td>
                    <td>
                      <button
                        className="btn-sm btn-secondary"
                        onClick={() => handleDownloadFile(result.id, result.fileName)}
                      >
                        📥 İndir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. DEĞERLENDİRMELER SEKMESİ */}
      {activeTab === 'reviews' && (
        <div className="reviews-container">
          {appointments.filter(apt => apt.hasReview).length === 0 ? (
            <p className="no-data">Henüz bir değerlendirme yapmadınız.</p>
          ) : (
            appointments.filter(apt => apt.hasReview).map((apt) => (
              <div key={apt.id} className="review-card">
                <div className="review-header">
                  <h3>{apt.doctorName}</h3>
                  <div className="rating-stars">{'⭐'.repeat(apt.reviewRating)}</div>
                </div>
                <p className="review-date">{new Date(apt.date).toLocaleDateString('tr-TR')}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. AYARLAR SEKMESİ */}
      {activeTab === 'settings' && (
        <div className="settings-container">
          <div className="settings-card">
            <div className="settings-header">
              <h3>Kişisel Bilgiler</h3>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="settings-form-group">
                  <label className="form-label">Ad</label>
                  <input type="text" className="form-input"
                    value={profileData.firstName}
                    disabled
                  />
                </div>
                <div className="settings-form-group">
                  <label className="form-label">Soyad</label>
                  <input type="text" className="form-input"
                    value={profileData.lastName}
                    disabled
                  />
                </div>
              </div>

              <div className="settings-form-group">
                <label className="form-label">E-Posta Adresi</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Telefon Numarası</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="settings-form-group">
                  <label className="form-label">Doğum Tarihi</label>
                  <input
                    type="date"
                    className="form-input"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="settings-form-group">
                  <label className="form-label">Kan Grubu</label>
                  <select
                    className="form-input"
                    value={profileData.bloodType}
                    onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
                  >
                    <option value="">Seçiniz</option>
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
                <label className="form-label">Adres</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  placeholder="İl, ilçe, mahalle, sokak..."
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Acil Durum İletişim</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <button type="submit" className="btn-save" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white' }} disabled={loading}>
                {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>

          <div className="settings-card">
            <div className="settings-header">
              <h3>Güvenlik & Şifre</h3>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="settings-form-group">
                <label className="form-label">Mevcut Şifre</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Yeni Şifre</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-save btn-danger-action" style={{ background: 'white', color: '#ef4444', border: '1px solid #fecaca' }} disabled={loading}>
                {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Değerlendir</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="appointment-info">
              <p><strong>Doktor:</strong> {selectedAppointment?.doctorName}</p>
            </div>
            <form onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label>Puanınız</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${star <= review.rating ? 'active' : ''}`}
                      onClick={() => setReview({ ...review, rating: star })}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Yorumunuz</label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowReviewModal(false)}>İptal</button>
                <button type="submit" className="btn-primary">Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}