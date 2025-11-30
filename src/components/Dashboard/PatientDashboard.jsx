import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // ✅ AUTH CONTEXT EKLENDİ
import './SharedDashboard.css';

const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function PatientDashboard() {
  const { user } = useAuth(); // ✅ GİRİŞ YAPAN KULLANICI BİLGİSİNİ ALIYORUZ

  const [activeTab, setActiveTab] = useState('appointments'); 
  
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  // Profil verilerini başlangıçta boş bırakıyoruz
  const [profileData, setProfileData] = useState({
    email: '',
    phoneNumber: '',
    firstName: '',
    lastName: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ KULLANICI VERİSİNİ STATE'E AKTARMA
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
    fetchLabResults();
  }, [timeFilter]);

  // Randevuları Çek (Mock Data)
  const fetchAppointments = async () => {
    try {
      const mockAppointments = [
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          department: 'Kardiyoloji',
          date: new Date(Date.now() + 86400000 * 2).toISOString(),
          time: '10:00',
          status: 'CONFIRMED',
          hasReview: false
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Smith',
          department: 'Dahiliye',
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          time: '14:30',
          status: 'COMPLETED',
          hasReview: true,
          reviewRating: 5
        },
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Sonuçları Çek (Mock Data)
  const fetchLabResults = async () => {
    try {
      const mockLabResults = [
        {
          id: 1,
          testName: 'Tam Kan Sayımı (Hemogram)',
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: 'COMPLETED',
          doctorName: 'Dr. Johnson',
          hasFile: true
        },
      ];
      setLabResults(mockLabResults);
    } catch (error) {
      console.error('Error fetching lab results:', error);
    }
  };

  // Profil Güncelleme
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Backend entegrasyonu yapılana kadar simülasyon
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Güncelleme başarısız: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  // Şifre Güncelleme
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Şifre değiştirilemedi.' });
    } finally {
      setLoading(false);
    }
  };

  // Değerlendirme Gönderme
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      alert('Yorumunuz başarıyla gönderildi!');
      setShowReviewModal(false);
      setSelectedAppointment(null);
      setReview({ rating: 5, comment: '' });
      fetchAppointments();
    } catch (error) {
      alert('Hata: ' + error.message);
    }
  };

  const handleDownloadReport = (labResult) => {
    alert(`${labResult.testName} raporu indiriliyor...`);
  };

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const now = new Date();
    if (timeFilter === 'past') return aptDate < now;
    if (timeFilter === 'future') return aptDate >= now;
    return true;
  });

  if (!user) return <div style={{padding:'40px', textAlign:'center'}}>Yükleniyor...</div>;

  return (
    <div className="dashboard-page">
      {/* 🟢 BAŞLIK ALANI: Gerçek Kullanıcı İsmi */}
      <div className="page-header">
        <div>
          <h1 style={{ marginBottom: '5px' }}>
             {profileData.firstName} {profileData.lastName}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Hasta Paneli</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`} style={{
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
              <label>Göster:</label>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="all">Tüm Randevular</option>
                <option value="future">Gelecek Randevular</option>
                <option value="past">Geçmiş Randevular</option>
              </select>
            </div>
          </div>

          <div className="appointments-grid">
            {filteredAppointments.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Kayıtlı randevu bulunamadı.
              </p>
            ) : (
              filteredAppointments.map((apt) => (
                <div key={apt.id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.doctorName}</h3>
                    <span className={`badge badge-${apt.status.toLowerCase()}`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Bölüm:</strong> {apt.department}</p>
                    <p><strong>Tarih:</strong> {new Date(apt.date).toLocaleDateString('tr-TR')}</p>
                    <p><strong>Saat:</strong> {apt.time}</p>
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
        <div className="data-table-container">
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
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Sonuç bulunamadı.</td></tr>
              ) : (
                labResults.map((result) => (
                  <tr key={result.id}>
                    <td><strong>{result.testName}</strong></td>
                    <td>{new Date(result.date).toLocaleDateString('tr-TR')}</td>
                    <td>{result.doctorName}</td>
                    <td><span className="badge badge-success">{result.status}</span></td>
                    <td>
                      <button className="btn-small btn-primary" onClick={() => handleDownloadReport(result)}>
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
            <p style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Henüz bir değerlendirme yapmadınız.
            </p>
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

      {/* 4. AYARLAR SEKMESİ (GÜZELLEŞTİRİLMİŞ) */}
      {activeTab === 'settings' && (
        <div className="settings-container">
          
          {/* KART 1: Profil Bilgileri */}
          <div className="settings-card">
            <div className="settings-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <h3>Kişisel Bilgiler</h3>
            </div>
            
            <form onSubmit={handleUpdateProfile}>
              <div className="form-row">
                  <div className="settings-form-group">
                    <label className="form-label">Ad</label>
                    <input type="text" className="form-input" value={profileData.firstName} disabled />
                  </div>
                  <div className="settings-form-group">
                    <label className="form-label">Soyad</label>
                    <input type="text" className="form-input" value={profileData.lastName} disabled />
                  </div>
              </div>

              <div className="settings-form-group">
                <label className="form-label">E-Posta Adresi</label>
                <input 
                  type="email" 
                  className="form-input"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  placeholder="ornek@email.com"
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Telefon Numarası</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                  placeholder="0555..."
                />
              </div>

              <button type="submit" className="btn-save btn-primary-action" disabled={loading}>
                  {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>

          {/* KART 2: Güvenlik */}
          <div className="settings-card">
            <div className="settings-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
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
                  placeholder="••••••••"
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Yeni Şifre</label>
                <input 
                  type="password" 
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="En az 6 karakter"
                />
              </div>

              <div className="settings-form-group">
                <label className="form-label">Yeni Şifre (Tekrar)</label>
                <input 
                  type="password" 
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-save btn-danger-action" disabled={loading}>
                 {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Değerlendir</h2>
              <button className="modal-close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <div className="appointment-info">
              <p><strong>Doktor:</strong> {selectedAppointment?.doctorName}</p>
              <p><strong>Tarih:</strong> {new Date(selectedAppointment?.date).toLocaleDateString('tr-TR')}</p>
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
                <label>Yorumunuz (İsteğe bağlı)</label>
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