// src/components/pages/panels/DoctorPanel.jsx

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
// Doğru import yolu: (../ ile 3 seviye yukarı çıkıp context'e erişiyoruz)
import { usePersonnelAuth } from '../../../context/PersonnelAuthContext';
import "./DoctorPanelPage.css"; 

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// --- İkonlar ---
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const BlueArrowIcon = ({ isOpen }) => (
  <svg className={`toggle-arrow ${isOpen ? 'open' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#45b5c4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function DoctorPanel() {
  const navigate = useNavigate();
  const { user, logoutPersonnel, loginPersonnel } = usePersonnelAuth();
  
  // --- AKORDİYON STATE'LERİ ---
  const [showSearchPatient, setShowSearchPatient] = useState(false);
  const [showLeaveRequest, setShowLeaveRequest] = useState(false);
  const [showWeeklyPlan, setShowWeeklyPlan] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);

  // HASTA ARAMA STATE'LERİ
  const [searchTckn, setSearchTckn] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [searchStatus, setSearchStatus] = useState(''); // 'loading', 'success', 'error'
  
  // İZİN FORMU STATE'LERİ
  const [leaveForm, setLeaveForm] = useState({
    startDate: '', startTime: '09:00', endDate: '', endTime: '18:00', reason: ''
  });
  const [leaveMessage, setLeaveMessage] = useState('');
  const [leaveStatus, setLeaveStatus] = useState(''); 

  // RANDEVU STATE'LERİ
  const [appointments, setAppointments] = useState([]);
  const [appLoading, setAppLoading] = useState(false);

  // Modal State (Profil Düzenleme)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editValueConfirm, setEditValueConfirm] = useState("");
  
  const [error, setError] = useState("");

  // YÜKLEME KONTROLÜ
  if (user === undefined) { 
    return <div style={{textAlign: 'center', padding: '100px', fontSize: '20px'}}>Kullanıcı Bilgileri Yükleniyor...</div>
  }
  
  // ROL KONTROLÜ
  if (!user || user.role !== 'DOCTOR') {
    return (
      <div style={{textAlign: 'center', padding: '100px', fontSize: '20px', color: '#c1272d', fontWeight: 'bold'}}>
        Yetkiniz yok. Lütfen doğru rol ile <a href="/personelLogin" style={{color: '#0e2b4b'}}>giriş yapın</a>.
      </div>
    );
  }

  const doctorSpecialization = user.specialization || 'Tanımlanmamış';

  // --- RANDEVULARI ÇEKME FONKSİYONU ---
  const fetchAppointments = async () => {
<<<<<<< HEAD
      if (!user || !user.doctorId) return;
      setAppLoading(true);
      try {
          const res = await axios.get(`${BaseURL}/appointments`, {
              params: { list: 'true', doctorId: user.doctorId }
=======
      if (!user || !user.id) return;
      setAppLoading(true);
      try {
          const res = await axios.get(`${BaseURL}/appointments`, {
              params: { list: 'true', doctorId: user.id }
>>>>>>> main
          });
          setAppointments(res.data.data || []);
      } catch (err) {
          console.error("Randevular çekilemedi:", err);
      } finally {
          setAppLoading(false);
      }
  };

  // "Randevularım" akordiyonu açıldığında veriyi çek
  useEffect(() => {
      if (showAppointments) {
          fetchAppointments();
      }
  }, [showAppointments]);

  // --- RANDEVU DURUMU GÜNCELLEME (Sadece İptal) ---
  const handleAppointmentStatus = async (id, newStatus) => {
      const token = localStorage.getItem('personnelToken');
      try {
          await axios.put(`${BaseURL}/appointments/${id}/status`, 
              { status: newStatus },
              { headers: { Authorization: `Bearer ${token}` } }
          );
          // Listeyi güncelle
          fetchAppointments();
          alert(`Randevu durumu güncellendi: ${newStatus === 'CANCELLED' ? 'İptal Edildi' : newStatus}`);
      } catch (err) {
          alert("İşlem başarısız: " + (err.response?.data?.message || err.message));
      }
  };

  // --- HASTA ARAMA İŞLEVİ ---
  async function handlePatientSearch(e) {
    e.preventDefault();
    setFoundPatient(null);
    setSearchStatus('loading');
    
    const normalizedTckn = (searchTckn || '').replace(/\D/g, '');
    if (normalizedTckn.length !== 11) {
      setSearchStatus('error');
      setFoundPatient({ message: "Lütfen 11 haneli TC Kimlik numarası girin." });
      return;
    }
    
    try {
      const patientsRes = await axios.get(`${BaseURL}/patients`); 
      const allPatients = patientsRes.data.users || [];
      
      const patient = allPatients.find(p => p.tckn === normalizedTckn);

      if (patient) {
        setFoundPatient(patient);
        setSearchStatus('success');
      } else {
        setSearchStatus('error');
        setFoundPatient({ message: "Bu TCKN ile kayıtlı hasta bulunamadı." });
      }

    } catch (err) {
      setSearchStatus('error');
      setFoundPatient({ message: "Hasta arama sırasında bir hata oluştu." });
      console.error(err);
    }
  }

  // --- İZİN TALEP İŞLEVİ ---
  function handleLeaveFormChange(e) {
    const { name, value } = e.target;
    setLeaveForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleLeaveRequestSubmit(e) {
    e.preventDefault();
    setLeaveMessage('');
    setLeaveStatus('pending');

    const token = localStorage.getItem('personnelToken');
    if (!token) return setLeaveMessage('Oturum süreniz doldu, lütfen tekrar giriş yapın.');

<<<<<<< HEAD
    if (!user.doctorId) {
        setLeaveMessage('Doktor bilgisi bulunamadı.');
        setLeaveStatus('error');
        return;
    }

    const payload = {
        personnelId: user.doctorId, // Use doctorId from Doctor table, not user.id
=======
    const payload = {
        personnelId: user.id,
>>>>>>> main
        personnelFirstName: user.firstName,
        personnelLastName: user.lastName,
        personnelRole: user.role,
        ...leaveForm
    };

    try {
        const res = await axios.post(`${BaseURL}/leave-requests`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setLeaveMessage(res.data?.message || "İzin talebi başarıyla gönderildi.");
        setLeaveStatus('success');
        setLeaveForm({ startDate: '', startTime: '09:00', endDate: '', endTime: '18:00', reason: '' });
    } catch (err) {
        setLeaveMessage(err.response?.data?.message || "İzin talebi gönderilirken bir hata oluştu.");
        setLeaveStatus('error');
    }
  }

  function handleLogout() {
    logoutPersonnel();
    navigate('/personelLogin', { replace: true });
  }

  // --- PROFİL DÜZENLEME ---
  const openEditModal = (field) => {
    setEditField(field);
    setEditValue(user[field === 'phone' ? 'phoneNumber' : field === 'specialization' ? 'specialization' : field] || '');
    setEditValueConfirm("");
    setError("");
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditField(null);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem('personnelToken');

    if (editField === 'password') {
      if (editValue.length < 8) return setError("Şifre en az 8 karakter olmalıdır.");
      if (editValue !== editValueConfirm) return setError("Şifreler uyuşmuyor!");
    }

    const updateData = {};
    if (editField === 'email') updateData.email = editValue;
    if (editField === 'phone') updateData.phoneNumber = editValue;
    if (editField === 'password') updateData.password = editValue;
    if (editField === 'specialization') updateData.specialization = editValue;

    try {
      await axios.put(`${BaseURL}/personnel/${user.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loginpersonnel(token); 
      alert("Bilgiler başarıyla güncellendi!");
      closeEditModal();
    } catch (err) {
      setError(err.response?.data?.message || "Güncelleme başarısız.");
    }
  };

  const getModalTitle = () => {
    switch(editField) {
      case 'email': return 'E-Posta Adresini Güncelle';
      case 'phone': return 'Telefon Numarasını Güncelle';
      case 'password': return 'Yeni Şifre Belirle';
      case 'specialization': return 'Uzmanlık Alanını Güncelle';
      default: return 'Düzenle';
    }
  };
  
  // Saat seçenekleri
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push(`${String(i).padStart(2, '0')}:00`);
    timeSlots.push(`${String(i).padStart(2, '0')}:30`);
  }

  return (
    <div className="doctor-page-wrapper">
      
      <div className="doctor-top-section">
        <div className="doctor-inner-container">
          <div className="panel-top-header">
            <h2 className="doctor-panel-title">Doktor Paneli</h2>
            <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
          </div>
          
          {/* PROFİL KARTI */}
          <section className="doctor-profile-card">
            <div className="profile-header-strip">Profil Bilgileri</div>
            <div className="profile-content">
              <div className="profile-avatar-section">
                {user.photoUrl ? <img src={user.photoUrl} alt="Profil" className="avatar-img" /> : <div className="avatar-placeholder"><span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span></div>}
                <span className="avatar-label">Hekim Fotoğrafı</span>
              </div>
              
              <div className="profile-details-grid">
                <div className="profile-item"><span className="label">Adı:</span><span className="value-box readonly">{user.firstName}</span></div>
                <div className="profile-item"><span className="label">Soyadı:</span><span className="value-box readonly">{user.lastName}</span></div>
                
                <div className="profile-item"><span className="label">Uzmanlık:</span>
                  <div className="value-container">
                    <span className="value-box">{doctorSpecialization}</span>
                    <button className="edit-icon-btn" onClick={() => openEditModal('specialization')}><EditIcon /></button>
                  </div>
                </div>
                
                <div className="profile-item"><span className="label">TC Kimlik:</span><span className="value-box readonly">{user.tckn}</span></div>
                
                <div className="profile-item"><span className="label">E-Posta:</span>
                  <div className="value-container">
                    <span className="value-box">{user.email || "-"}</span>
                    <button className="edit-icon-btn" onClick={() => openEditModal('email')}><EditIcon /></button>
                  </div>
                </div>
                <div className="profile-item"><span className="label">Telefon:</span>
                  <div className="value-container">
                    <span className="value-box">{user.phoneNumber || "-"}</span>
                    <button className="edit-icon-btn" onClick={() => openEditModal('phone')}><EditIcon /></button>
                  </div>
                </div>
                
                <div className="profile-item"><span className="label">Şifre:</span>
                  <div className="value-container">
                    <span className="value-box">********</span>
                    <button className="edit-icon-btn" onClick={() => openEditModal('password')}><EditIcon /></button>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header"><h3>{getModalTitle()}</h3><button onClick={closeEditModal} className="modal-close-btn"><CloseIcon /></button></div>
            <form onSubmit={handleUpdateSubmit} className="modal-form">
              {(editField === 'password') ? (
                <>
                  <div className="modal-field"><label>Yeni Şifre</label><input type="password" value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="En az 8 karakter" required /></div>
                  <div className="modal-field"><label>Yeni Şifre (Tekrar)</label><input type="password" value={editValueConfirm} onChange={(e) => setEditValueConfirm(e.target.value)} placeholder="Şifreyi tekrar girin" required /></div>
                </>
              ) : (
                <div className="modal-field"><label>Yeni Değer</label><input type={(editField === 'email' || editField === 'specialization') ? 'text' : 'text'} value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={editField === 'phone' ? "0555..." : editField === 'email' ? "ornek@mail.com" : "Yeni Uzmanlık Alanı"} required /></div>
              )}
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-actions"><button type="button" onClick={closeEditModal} className="cancel-btn">İptal</button><button type="submit" className="save-btn">Güncelle</button></div>
            </form>
          </div>
        </div>
      )}

      {/* ALT BÖLÜM: DOKTOR İŞLEVLERİ */}
      <div className="doctor-bottom-section">
        <div className="doctor-inner-container">
          
          {/* 1. HASTA ARAMA */}
          <section>
            <div className="section-header" onClick={() => setShowSearchPatient(!showSearchPatient)}>
              <h3>1. Hasta Arama</h3>
              <BlueArrowIcon isOpen={showSearchPatient} />
            </div>
            {showSearchPatient && (
              <div className="section-content-anim">
                <form onSubmit={handlePatientSearch} className="patient-search-form">
                    <input 
                        type="text"
                        placeholder="Hastanın TC Kimlik No'su"
                        value={searchTckn}
                        onChange={(e) => setSearchTckn(e.target.value)}
                        maxLength={11}
                        minLength={11}
                        required
                        style={{flexGrow: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}}
                    />
                    <button 
                        type="submit" 
                        disabled={searchStatus === 'loading'}
                        style={{background: '#45b5c4', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '6px', fontWeight: 'bold'}}
                    >
                        {searchStatus === 'loading' ? 'Aranıyor...' : 'Ara'}
                    </button>
                </form>
                
                {searchStatus === 'error' && foundPatient && (
                    <div className="status-message error-message" style={{marginTop: '10px'}}>
                        {foundPatient.message}
                    </div>
                )}
                {searchStatus === 'success' && foundPatient && (
                    <div className="status-message success-message" style={{background: '#dcfce7', color: '#166534', padding: '15px', marginTop: '10px', borderRadius: '6px', border: '1px solid #bbf7d0'}}>
                        <h4>✅ Hasta Bulundu:</h4>
                        <p style={{margin:'5px 0'}}><strong>Ad Soyad:</strong> {foundPatient.firstName} {foundPatient.lastName}</p>
                        <p style={{margin:'5px 0'}}><strong>TCKN:</strong> {foundPatient.tckn}</p>
                        <p style={{margin:'5px 0'}}><strong>E-posta:</strong> {foundPatient.email || '-'}</p>
                        <p style={{margin:'5px 0'}}><strong>Doğum Tarihi:</strong> {foundPatient.dateOfBirth || '-'}</p>
                        <button style={{marginTop: '10px', background: '#4ab43f', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer'}}>
                            Dosyayı Görüntüle (İşlevsiz)
                        </button>
                    </div>
                )}
              </div>
            )}
          </section>

          {/* 2. İZİN ALMA */}
          <section>
            <div className="section-header" onClick={() => setShowLeaveRequest(!showLeaveRequest)}>
              <h3>2. İzin Alma</h3>
              <BlueArrowIcon isOpen={showLeaveRequest} />
            </div>
            {showLeaveRequest && (
              <div className="section-content-anim">
                <form onSubmit={handleLeaveRequestSubmit} className="leave-request-form" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                        <div className="modal-field"><label>Başlangıç Tarihi</label><input type="date" name="startDate" value={leaveForm.startDate} onChange={handleLeaveFormChange} required /></div>
                        <div className="modal-field"><label>Başlangıç Saati</label>
                            <select name="startTime" value={leaveForm.startTime} onChange={handleLeaveFormChange} style={{padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} required>
                                {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>

                        <div className="modal-field"><label>Bitiş Tarihi</label><input type="date" name="endDate" value={leaveForm.endDate} onChange={handleLeaveFormChange} required /></div>
                        <div className="modal-field"><label>Bitiş Saati</label>
                            <select name="endTime" value={leaveForm.endTime} onChange={handleLeaveFormChange} style={{padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} required>
                                {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="modal-field"><label>Açıklama (İzin Nedeni)</label>
                        <textarea name="reason" value={leaveForm.reason} onChange={handleLeaveFormChange} placeholder="Örn: Yıllık İzin, Rapor" rows="3" style={{padding: '10px', border: '1px solid #ddd', borderRadius: '6px'}} required></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={leaveStatus === 'pending'}
                        style={{background: '#45b5c4', color: 'white', padding: '12px 15px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
                    >
                        {leaveStatus === 'pending' ? 'Talep Gönderiliyor...' : 'İzin Talebi Gönder'}
                    </button>
                </form>
                
                {leaveMessage && (
                    <div className={`status-message ${leaveStatus === 'error' ? 'error-message' : 'success-message'}`} style={{marginTop: '10px'}}>
                        {leaveMessage}
                    </div>
                )}
              </div>
            )}
          </section>

          {/* 3. HAFTALIK PLAN GÖRÜNTÜLEME */}
          <section>
            <div className="section-header" onClick={() => setShowWeeklyPlan(!showWeeklyPlan)}>
              <h3>3. Haftalık Plan Görüntüleme</h3>
              <BlueArrowIcon isOpen={showWeeklyPlan} />
            </div>
            {showWeeklyPlan && (
              <div className="section-content-anim">
                 <p className="action-info-box">
                  <i>Güncel nöbet, poliklinik ve ameliyat çizelgelerinin görüntüleneceği arayüz burada yer alacaktır.</i>
                </p>
              </div>
            )}
          </section>

          {/* 4. RANDEVULARIM */}
          <section>
            <div className="section-header" onClick={() => setShowAppointments(!showAppointments)}>
              <h3>4. Randevularım</h3>
              <BlueArrowIcon isOpen={showAppointments} />
            </div>
            {showAppointments && (
              <div className="section-content-anim">
                 {appLoading ? (
                     <p style={{padding:10}}>Yükleniyor...</p>
                 ) : appointments.length === 0 ? (
                     <p className="action-info-box">Henüz planlanmış bir randevunuz bulunmamaktadır.</p>
                 ) : (
                     <div className="table-responsive">
                        <table className="personnel-table" style={{width:'100%'}}>
                            <thead>
                                <tr>
                                    <th>Tarih / Saat</th>
                                    <th>Hasta Adı</th>
                                    <th>Durum</th>
                                    <th style={{textAlign:'center'}}>İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(app => (
                                    <tr key={app.id} style={{opacity: app.status === 'CANCELLED' ? 0.5 : 1}}>
                                        <td>{app.date} <br/><small>{app.time}</small></td>
                                        <td>{app.patientFirstName} {app.patientLastName}</td>
                                        <td>
                                            <span style={{
                                                padding:'4px 8px', borderRadius:'4px', fontSize:'0.85rem', fontWeight:'bold',
                                                background: app.status === 'APPROVED' ? '#dcfce7' : app.status === 'PENDING' ? '#fff7ed' : '#fee2e2',
                                                color: app.status === 'APPROVED' ? '#166534' : app.status === 'PENDING' ? '#c2410c' : '#991b1b'
                                            }}>
                                                {app.status === 'PENDING' ? 'Bekliyor' : app.status === 'APPROVED' ? 'Onaylı' : 'İptal'}
                                            </span>
                                        </td>
                                        <td style={{textAlign:'center'}}>
                                            {app.status !== 'CANCELLED' ? (
                                                <button 
                                                    onClick={() => handleAppointmentStatus(app.id, 'CANCELLED')}
                                                    style={{
                                                        background: '#c1272d', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        padding: '6px 12px', 
                                                        borderRadius: '6px', 
                                                        cursor: 'pointer', 
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    İptal Et
                                                </button>
                                            ) : (
                                                <span style={{color: '#999', fontStyle: 'italic'}}>İptal Edildi</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                 )}
              </div>
            )}
          </section>

        </div>
      </div>

    </div>
  );
}