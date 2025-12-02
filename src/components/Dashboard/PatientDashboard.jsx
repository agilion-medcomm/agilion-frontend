import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './SharedDashboard.css'; 

export default function PatientDashboard() {
  // ✅ Vite uyumlu API adresi
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
  const BaseURL = `${API_BASE}/api/v1`;

  const { user } = useAuth(); 
  const location = useLocation();

  // URL'e göre başlangıç sekmesi
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname.includes('/profile')) return 'settings';
    return 'appointments';
  });
  
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
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

  // ✅ ARTIK EN TEMİZ YÖNTEMİ KULLANIYORUZ
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('patientToken');
      
      if (!token) throw new Error("Oturum anahtarı bulunamadı.");

      // Backend sorunu çözüldüğü için artık doğrudan bu endpoint'i kullanabiliriz.
      // Bu, ID'yi URL'de açıkça göndermekten çok daha güvenlidir.
      const response = await axios.get(`${BaseURL}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data.data || response.data;
      setAppointments(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Randevular alınamadı:', error);
      // Hata durumunda listeyi temiz tutuyoruz
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabResults = async () => {
    // Mock Data (İleride backend'e bağlanabilir)
    const mockLabResults = [
      {
        id: 1,
        testName: 'Tam Kan Sayımı (Hemogram)',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'COMPLETED',
        doctorName: 'Dr. Ahmet Yılmaz',
        hasFile: true
      },
    ];
    setLabResults(mockLabResults);
  };

  // --- FORM İŞLEMLERİ ---

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${BaseURL}/patients/me/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Güncelleme başarısız: ' + (error.response?.data?.message || 'Hata oluştu') });
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
      const token = localStorage.getItem('token');
      await axios.put(`${BaseURL}/patients/me/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Şifre değiştirilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
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

  // Randevuları filtreleme (Geçmiş / Gelecek)
  const filteredAppointments = appointments.filter(apt => {
    const dateStr = apt.date || apt.startTime || apt.createdAt;
    let aptDate = new Date();
    
    // Tarih formatını kontrol et ve parse et
    if (dateStr && dateStr.includes('.')) {
        const parts = dateStr.split('.');
        aptDate = new Date(parts[2], parts[1]-1, parts[0]);
    } else if (dateStr) {
        aptDate = new Date(dateStr);
    }

    const now = new Date();
    if (timeFilter === 'past') return aptDate < now;
    if (timeFilter === 'future') return aptDate >= now;
    return true;
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
              </select>
            </div>
          </div>

          <div className="appointments-grid">
            {loading ? (
               <p>Yükleniyor...</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="no-data">Kayıtlı randevu bulunamadı.</p>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.doctorName || (apt.doctor ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Doktor Belirtilmedi')}</h3>
                    <span className={`badge badge-${apt.status?.toLowerCase() || 'pending'}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Bölüm:</strong> {apt.departmentName || (apt.department && apt.department.name) || 'Genel'}</p>
                    <p><strong>Tarih:</strong> {apt.date || (apt.startTime && new Date(apt.startTime).toLocaleDateString('tr-TR'))}</p>
                    <p><strong>Saat:</strong> {apt.time || (apt.startTime && new Date(apt.startTime).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}))}</p>
                  </div>
                  
                  {apt.status === 'COMPLETED' && !apt.hasReview && (
                    <button 
                      className="btn-primary"
                      onClick={() => { setSelectedAppointment(apt); setShowReviewModal(true); }}
                    >
                      Değerlendir
                    </button>
                  )}
                  {apt.hasReview && (
                    <div className="review-indicator">⭐ Puanınız: {apt.reviewRating}/5</div>
                  )}
                </div>
              ))
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
                <th>Doktor</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {labResults.length === 0 ? (
                <tr><td colSpan="5" className="no-data">Sonuç bulunamadı.</td></tr>
              ) : (
                labResults.map((result) => (
                  <tr key={result.id}>
                    <td><strong>{result.testName}</strong></td>
                    <td>{new Date(result.date).toLocaleDateString('tr-TR')}</td>
                    <td>{result.doctorName}</td>
                    <td><span className="badge badge-completed">{result.status}</span></td>
                    <td>
                      <button className="btn-sm btn-secondary" onClick={() => handleDownloadReport(result)}>
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
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Telefon Numarası</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="settings-form-group">
                  <label className="form-label">Doğum Tarihi</label>
                  <input 
                    type="date" 
                    className="form-input"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="settings-form-group">
                  <label className="form-label">Kan Grubu</label>
                  <select 
                    className="form-input"
                    value={profileData.bloodType}
                    onChange={(e) => setProfileData({...profileData, bloodType: e.target.value})}
                  >
                    <option value="">Seçiniz</option>
                    <option value="A+">A Rh+</option>
                    <option value="A-">A Rh-</option>
                    <option value="B+">B Rh+</option>
                    <option value="B-">B Rh-</option>
                    <option value="AB+">AB Rh+</option>
                    <option value="AB-">AB Rh-</option>
                    <option value="0+">0 Rh+</option>
                    <option value="0-">0 Rh-</option>
                  </select>
                </div>
              </div>

              <div className="settings-form-group">
                <label className="form-label">Adres</label>
                <textarea 
                  className="form-input"
                  rows="3"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="İl, ilçe, mahalle, sokak..."
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Acil Durum İletişim</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <button type="submit" className="btn-save" style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white'}} disabled={loading}>
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
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Yeni Şifre</label>
                <input 
                  type="password" 
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Yeni Şifre (Tekrar)</label>
                <input 
                  type="password" 
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>

              <button type="submit" className="btn-save btn-danger-action" style={{background: 'white', color: '#ef4444', border: '1px solid #fecaca'}} disabled={loading}>
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
                      onClick={() => setReview({...review, rating: star})}
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
                  onChange={(e) => setReview({...review, comment: e.target.value})}
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