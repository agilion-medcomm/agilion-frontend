import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './PatientProfilePage.css';

// API URL
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

// --- İKONLAR ---
const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const CalendarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ActivityIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const FileTextIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

export default function PatientProfilePage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('settings'); // 'settings', 'appointments', 'results'
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false); // Tablo verileri için loading
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Veri State'leri (API'den dolacak)
  const [appointments, setAppointments] = useState([]);
  const [labResults, setLabResults] = useState([]);

  // Form State
  const [formData, setFormData] = useState({ email: '', phoneNumber: '' });
  const [passData, setPassData] = useState({ newPassword: '', confirmPassword: '' });

  // 1. Kullanıcı bilgisi gelince formu doldur
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      });
      // Sayfa ilk açıldığında verileri çek
      fetchPatientData();
    }
  }, [user]);

  // 2. API'den Randevu ve Sonuçları Çeken Fonksiyon
  const fetchPatientData = async () => {
    if (!user?.id) return;
    setDataLoading(true);

    try {
        // A) Randevuları Çek
        // Backend: GET /api/v1/appointments?list=true&patientId=...
        const appRes = await axios.get(`${BaseURL}/appointments`, {
            params: { list: 'true', patientId: user.id },
            headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appRes.data?.data || []);

        // B) Laboratuvar Sonuçlarını Çek (Endpoint hazır olunca çalışır)
        // Backend: GET /api/v1/lab-results?patientId=... (Tahmini endpoint)
        try {
            const labRes = await axios.get(`${BaseURL}/lab-results`, {
                params: { patientId: user.id },
                headers: { Authorization: `Bearer ${token}` }
            });
            setLabResults(labRes.data?.data || []);
        } catch (labErr) {
            console.warn("Lab sonuçları çekilemedi (Endpoint henüz yok olabilir):", labErr.message);
            // Lab endpointi yoksa boş dizi kalsın, hata patlatmasın
            setLabResults([]);
        }

    } catch (error) {
        console.error("Veri çekme hatası:", error);
    } finally {
        setDataLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePassChange = (e) => setPassData({ ...passData, [e.target.name]: e.target.value });

  // PROFİL GÜNCELLEME
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(''); setErrorMsg('');

    try {
        await axios.put(`${BaseURL}/patients/${user.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg("Profil bilgileriniz güncellendi.");
    } catch (err) {
        setErrorMsg(err.response?.data?.message || "Güncelleme başarısız.");
    } finally {
        setLoading(false);
    }
  };

  // ŞİFRE GÜNCELLEME
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
        setErrorMsg("Şifreler uyuşmuyor.");
        return;
    }
    setLoading(true);
    setSuccessMsg(''); setErrorMsg('');
    
    try {
        await axios.put(`${BaseURL}/patients/${user.id}`, { password: passData.newPassword }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setSuccessMsg("Şifreniz değiştirildi.");
        setPassData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
        setErrorMsg(err.response?.data?.message || "Şifre değiştirilemedi.");
    } finally {
        setLoading(false);
    }
  };

  if (!user) return <div className="profile-loading">Yükleniyor...</div>;

  return (
    <div className="patient-profile-wrapper">
      
      {/* ÜST BİLGİ KARTI */}
      <div className="profile-header-card">
        <div className="header-avatar">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
        <div className="header-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <div className="badges">
                <span className="badge patient">HASTA</span>
                <span className="badge id">#{user.id}</span>
            </div>
        </div>
        <div className="header-stats">
            <div className="stat-box">
                <span className="stat-val">{appointments.length}</span>
                <span className="stat-label">Randevu</span>
            </div>
            <div className="stat-box">
                <span className="stat-val">{labResults.length}</span>
                <span className="stat-label">Sonuç</span>
            </div>
        </div>
      </div>

      {/* SEKME MENÜSÜ */}
      <div className="profile-tabs">
        <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} 
            onClick={() => setActiveTab('settings')}
        >
            <UserIcon /> Profil Ayarları
        </button>
        <button 
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('appointments'); fetchPatientData(); }} // Tıklayınca yenile
        >
            <CalendarIcon /> Randevularım
        </button>
        <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('results'); fetchPatientData(); }} // Tıklayınca yenile
        >
            <ActivityIcon /> Tahlil Sonuçları
        </button>
      </div>

      {successMsg && <div className="alert-box success">{successMsg}</div>}
      {errorMsg && <div className="alert-box error">{errorMsg}</div>}

      {/* İÇERİK ALANI */}
      <div className="tab-content">
        
        {/* 1. PROFİL AYARLARI */}
        {activeTab === 'settings' && (
            <div className="settings-grid">
                <div className="profile-card">
                    <div className="card-title"><UserIcon /> İletişim Bilgileri</div>
                    <form onSubmit={handleUpdate}>
                        <div className="input-group">
                            <label>E-Posta</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="input-group">
                            <label>Telefon</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                        </div>
                        <button className="save-btn" disabled={loading}>{loading ? '...' : 'Kaydet'}</button>
                    </form>
                </div>

                <div className="profile-card">
                    <div className="card-title"><LockIcon /> Şifre Değiştir</div>
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="input-group">
                            <label>Yeni Şifre</label>
                            <input type="password" name="newPassword" value={passData.newPassword} onChange={handlePassChange} placeholder="******" />
                        </div>
                        <div className="input-group">
                            <label>Tekrar</label>
                            <input type="password" name="confirmPassword" value={passData.confirmPassword} onChange={handlePassChange} placeholder="******" />
                        </div>
                        <button className="password-btn" disabled={loading}>Şifreyi Güncelle</button>
                    </form>
                </div>
            </div>
        )}

        {/* 2. RANDEVULAR (DİNAMİK) */}
        {activeTab === 'appointments' && (
            <div className="appointments-list">
                <div className="list-header">
                    <h3>Yaklaşan Randevular</h3>
                </div>
                
                {dataLoading ? (
                    <p style={{padding: '20px', color:'#666'}}>Randevular yükleniyor...</p>
                ) : appointments.length === 0 ? (
                    <div className="no-data-box">
                        <p>Henüz planlanmış bir randevunuz bulunmamaktadır.</p>
                        <button className="sm-btn" onClick={() => window.location.href='/hekimlerimiz'}>Randevu Al</button>
                    </div>
                ) : (
                    appointments.map((app) => (
                        <div key={app.id} className="appointment-card-item">
                            <div className={`date-box ${new Date(app.date?.split('.').reverse().join('-')) < new Date() ? 'past' : ''}`}>
                                <span className="day">{app.date?.split('.')[0]}</span>
                                <span className="month">
                                    {new Date(app.date?.split('.').reverse().join('-')).toLocaleDateString('tr-TR', { month: 'short' })}
                                </span>
                            </div>
                            <div className="app-details">
                                <h4>{app.doctorName || 'Doktor Bilgisi Yok'}</h4>
                                <p>Saat: {app.time} • {app.status === 'APPROVED' ? 'Onaylandı' : app.status === 'PENDING' ? 'Bekliyor' : 'İptal'}</p>
                            </div>
                            <span className={`status-badge ${app.status === 'APPROVED' ? 'upcoming' : 'completed'}`}>
                                {app.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        )}

        {/* 3. SONUÇLAR (DİNAMİK) */}
        {activeTab === 'results' && (
            <div className="results-list">
                <h3>Son Tahlil Sonuçları</h3>
                
                {dataLoading ? (
                    <p style={{padding: '20px', color:'#666'}}>Sonuçlar yükleniyor...</p>
                ) : labResults.length === 0 ? (
                    <div className="no-data-box">
                        <p>Kayıtlı laboratuvar sonucu bulunamadı.</p>
                    </div>
                ) : (
                    <div className="result-table">
                        <div className="table-row head">
                            <span>İşlem Adı</span>
                            <span>Tarih</span>
                            <span>Durum</span>
                            <span>Dosya</span>
                        </div>
                        
                        {labResults.map((res) => (
                            <div key={res.id} className="table-row">
                                <div className="res-name">
                                    <ActivityIcon /> 
                                    <div>
                                        <strong>{res.testName || 'Bilinmeyen Test'}</strong>
                                        <small>{res.category || 'Genel'}</small>
                                    </div>
                                </div>
                                <span>{new Date(res.date).toLocaleDateString('tr-TR')}</span>
                                <span className={`res-status ${res.status === 'COMPLETED' ? 'ready' : 'pending'}`}>
                                    {res.status === 'COMPLETED' ? 'Hazır' : 'İşleniyor'}
                                </span>
                                <button className={`pdf-btn ${res.status !== 'COMPLETED' ? 'disabled' : ''}`}>
                                    <FileTextIcon />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
}