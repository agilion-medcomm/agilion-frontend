import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../../context/PersonnelAuthContext';
import "./AdminPanelPage.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// --- İKONLAR ---
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const BlueArrowIcon = ({ isOpen }) => (
  <svg className={`toggle-arrow ${isOpen ? 'open' : ''}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- ANA BİLEŞEN ---
export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logoutPersonnel, loginPersonnel } = usePersonnelAuth();
  
  // Veri State'leri
  const [personnelList, setPersonnelList] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLeaveLoading, setIsLeaveLoading] = useState(false);

  // Akordiyon Görünüm State'leri
  const [sections, setSections] = useState({
    addForm: false,
    list: false,
    contact: false,
    leaves: false,
    cleaning: false
  });

  // Ekleme Formu State
  const [addForm, setAddForm] = useState({
    tckn: "", firstName: "", lastName: "", password: "", role: "DOCTOR",
    phoneNumber: "", email: "", dateOfBirth: "", specialization: ""
  });

  // --- MODAL STATE'LERİ ---
  
  // 1. Profil Düzenleme (Kendi Hesabı)
  const [profileModal, setProfileModal] = useState({ open: false, field: null, value: "", confirm: "" });
  
  // 2. Personel Düzenleme (Başkası)
  const [editPersonnelModal, setEditPersonnelModal] = useState({ open: false, data: null });

  // 3. Silme Onayı
  const [deleteModal, setDeleteModal] = useState({ open: false, data: null });

  // Mesajlar
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // YÜKLEME VE YETKİ KONTROLÜ
  if (user === undefined) return <div className="loading-screen">Yükleniyor...</div>;
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="unauthorized-screen">
        <h3>Yetkisiz Giriş</h3>
        <p>Bu sayfayı görüntüleme yetkiniz yok.</p>
        <button onClick={() => navigate('/personelLogin')}>Giriş Yap</button>
      </div>
    );
  }

  // Sayfa Yüklendiğinde Verileri Çek
  useEffect(() => {
    fetchPersonnel();
    fetchLeaveRequests();
  }, []);

  // --- API İŞLEMLERİ ---

  // Personel Listesini Çek
  const fetchPersonnel = async () => {
    const token = localStorage.getItem('personnelToken');
    if (!token) return;
    try {
      const res = await axios.get(`${BaseURL}/personnel`, { headers: { Authorization: `Bearer ${token}` } });
      setPersonnelList(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) { console.error("Personel listesi hatası:", err); }
  };

  // İzin Taleplerini Çek
  const fetchLeaveRequests = async () => {
    const token = localStorage.getItem('personnelToken');
    if (!token) return;
    setIsLeaveLoading(true);
    try {
      const res = await axios.get(`${BaseURL}/leave-requests`, { headers: { Authorization: `Bearer ${token}` } });
      const sorted = Array.isArray(res.data.data) 
        ? res.data.data.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)) 
        : [];
      setLeaveRequests(sorted);
    } catch (err) { console.error("İzin talebi hatası:", err); } 
    finally { setIsLeaveLoading(false); }
  };

  // Yeni Personel Ekle
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });
    const token = localStorage.getItem('personnelToken');
    
    const payload = { ...addForm, specialization: addForm.role === 'DOCTOR' ? addForm.specialization : "" };

    try {
      await axios.post(`${BaseURL}/personnel`, payload, { headers: { Authorization: `Bearer ${token}` } });
      setStatusMsg({ type: 'success', text: 'Personel başarıyla eklendi.' });
      setAddForm({ tckn: "", firstName: "", lastName: "", password: "", role: "DOCTOR", phoneNumber: "", email: "", dateOfBirth: "", specialization: "" });
      fetchPersonnel();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || "Ekleme başarısız." });
    }
  };

  // Personel Sil
  const handleDeleteConfirm = async () => {
    if (!deleteModal.data) return;
    const token = localStorage.getItem('personnelToken');
    try {
      await axios.delete(`${BaseURL}/personnel/${deleteModal.data.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setStatusMsg({ type: 'success', text: 'Personel silindi.' });
      setDeleteModal({ open: false, data: null });
      fetchPersonnel();
    } catch (err) {
      alert(err.response?.data?.message || "Silme işlemi başarısız.");
    }
  };

  // Personel Düzenle (Başkası) - ŞİFRE GÜNCELLEME DAHİL
  const handlePersonnelEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');
    
    // Backend'e göndermeden önce veriyi hazırla
    const dataToSend = { ...editPersonnelModal.data };

    // ÖNEMLİ: Eğer şifre alanı boş bırakıldıysa, backend'e "password" alanını hiç gönderme.
    // Böylece mevcut şifre korunur, boş string olarak ezilmez.
    if (!dataToSend.password || dataToSend.password.trim() === "") {
        delete dataToSend.password;
    }

    try {
      await axios.put(`${BaseURL}/personnel/${editPersonnelModal.data.id}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatusMsg({ type: 'success', text: 'Personel bilgileri güncellendi.' });
      setEditPersonnelModal({ open: false, data: null });
      fetchPersonnel();
    } catch (err) {
      alert(err.response?.data?.message || "Güncelleme başarısız.");
    }
  };

  // Kendi Profilini Düzenle
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');
    const { field, value, confirm } = profileModal;

    if (field === 'password') {
      if (value.length < 8) return alert("Şifre en az 8 karakter olmalı.");
      if (value !== confirm) return alert("Şifreler uyuşmuyor.");
    }

    const updateData = {};
    if (field === 'email') updateData.email = value;
    if (field === 'phone') updateData.phoneNumber = value;
    if (field === 'password') updateData.password = value;

    try {
      await axios.put(`${BaseURL}/personnel/${user.id}`, updateData, { headers: { Authorization: `Bearer ${token}` } });
      await loginPersonnel(token); 
      setProfileModal({ open: false, field: null, value: "", confirm: "" });
      alert("Bilgileriniz güncellendi.");
    } catch (err) {
      alert(err.response?.data?.message || "Güncelleme başarısız.");
    }
  };

  // İzin Onayla
  const handleApproveLeave = async (reqId) => {
    const token = localStorage.getItem('personnelToken');
    try {
      await axios.put(`${BaseURL}/leave-requests/${reqId}/status`, { status: 'APPROVED' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeaveRequests();
      alert("İzin onaylandı.");
    } catch (err) { alert("İşlem başarısız."); }
  };

  // Yardımcı Fonksiyonlar
  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));
  const handleLogout = () => { logoutPersonnel(); navigate('/personelLogin', { replace: true }); };
  const formatDateTime = (date, time) => date ? `${new Date(date).toLocaleDateString('tr-TR')} ${time}` : '-';

  return (
    <div className="admin-page-wrapper">
      
      {/* ÜST BÖLÜM: BAŞLIK VE PROFİL */}
      <div className="admin-top-section">
        <div className="admin-inner-container">
          <div className="panel-top-header">
            <h2 className="admin-panel-title">Yönetici Paneli</h2>
            <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
          </div>

          <section className="admin-profile-card">
            <div className="profile-header-strip">Yönetici Bilgileri</div>
            <div className="profile-content">
              <div className="profile-avatar-section">
                <div className="avatar-placeholder">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <span className="avatar-label">Admin</span>
              </div>
              <div className="profile-details-grid">
                <div className="profile-item"><span className="label">Ad Soyad:</span><span className="value-box readonly">{user.firstName} {user.lastName}</span></div>
                <div className="profile-item"><span className="label">TCKN:</span><span className="value-box readonly">{user.tckn}</span></div>
                
                <div className="profile-item">
                  <span className="label">E-Posta:</span>
                  <div className="value-container">
                    <span className="value-box">{user.email || '-'}</span>
                    <button className="edit-icon-btn" onClick={() => setProfileModal({ open: true, field: 'email', value: user.email || '' })}><EditIcon /></button>
                  </div>
                </div>

                <div className="profile-item">
                  <span className="label">Telefon:</span>
                  <div className="value-container">
                    <span className="value-box">{user.phoneNumber || '-'}</span>
                    <button className="edit-icon-btn" onClick={() => setProfileModal({ open: true, field: 'phone', value: user.phoneNumber || '' })}><EditIcon /></button>
                  </div>
                </div>

                <div className="profile-item">
                  <span className="label">Şifre:</span>
                  <div className="value-container">
                    <span className="value-box">********</span>
                    <button className="edit-icon-btn" onClick={() => setProfileModal({ open: true, field: 'password', value: '', confirm: '' })}><EditIcon /></button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ALT BÖLÜM: İŞLEMLER */}
      <div className="admin-bottom-section">
        <div className="admin-inner-container">
          
          {/* 1. YENİ PERSONEL EKLE */}
          <section className="personnel-section-wrapper">
            <div className="section-header" onClick={() => toggleSection('addForm')}>
              <h3>1. Yeni Personel Ekle</h3>
              <BlueArrowIcon isOpen={sections.addForm} />
            </div>
            {sections.addForm && (
              <div className="section-content-anim">
                <form className="personnel-add-form" onSubmit={handleAddSubmit}>
                  <div className="form-group-full">
                    <label>Personel Türü</label>
                    <select value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})} style={{fontWeight:'bold', color:'#c1272d'}}>
                      <option value="DOCTOR">Doktor</option>
                      <option value="LAB_TECHNICIAN">Laborant</option>
                      <option value="CASHIER">Vezne</option>
                      <option value="CLEANER">Temizlik Personeli</option>
                      <option value="ADMIN">Yönetici (Admin)</option>
                    </select>
                  </div>
                  <input placeholder="TC Kimlik No (11 Hane)" value={addForm.tckn} onChange={e => setAddForm({...addForm, tckn: e.target.value})} maxLength={11} required />
                  <input placeholder="Ad" value={addForm.firstName} onChange={e => setAddForm({...addForm, firstName: e.target.value})} required />
                  <input placeholder="Soyad" value={addForm.lastName} onChange={e => setAddForm({...addForm, lastName: e.target.value})} required />
                  <input placeholder="Şifre (Min 8 Karakter)" type="password" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} required />
                  <input placeholder="Telefon" value={addForm.phoneNumber} onChange={e => setAddForm({...addForm, phoneNumber: e.target.value})} />
                  <input placeholder="E-Posta" type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} />
                  <input type="date" value={addForm.dateOfBirth} onChange={e => setAddForm({...addForm, dateOfBirth: e.target.value})} />
                  {addForm.role === 'DOCTOR' && (
                    <input placeholder="Uzmanlık Alanı (Örn: Kardiyoloji)" value={addForm.specialization} onChange={e => setAddForm({...addForm, specialization: e.target.value})} style={{borderColor: '#c1272d'}} />
                  )}
                  <button type="submit">Personeli Kaydet</button>
                </form>
                {statusMsg.text && <div className={`status-message ${statusMsg.type === 'error' ? 'error-message' : 'success-message'}`}>{statusMsg.text}</div>}
              </div>
            )}
          </section>

          <hr className="divider"/>

          {/* 2. MEVCUT PERSONELLER */}
          <section className="personnel-section-wrapper">
            <div className="section-header" onClick={() => toggleSection('list')}>
              <h3>2. Mevcut Personeller</h3>
              <BlueArrowIcon isOpen={sections.list} />
            </div>
            {sections.list && (
              <div className="section-content-anim">
                <div className="table-responsive">
                  <table className="personnel-table">
                    <thead>
                      <tr><th>TCKN</th><th>Ad Soyad</th><th>Rol</th><th>Uzmanlık</th><th style={{textAlign:'center'}}>İşlemler</th></tr>
                    </thead>
                    <tbody>
                      {personnelList.map(p => (
                        <tr key={p.id}>
                          <td>{p.tckn}</td>
                          <td>{p.firstName} {p.lastName}</td>
                          <td>{p.role}</td>
                          <td>{p.specialization || '-'}</td>
                          <td style={{textAlign:'center', display:'flex', justifyContent:'center', gap:'10px'}}>
                            <button className="edit-icon-btn" onClick={() => setEditPersonnelModal({ open: true, data: { ...p, password: '' } })} title="Düzenle"><EditIcon /></button>
                            <button className="delete-icon-btn" onClick={() => { if(p.id === user.id) return alert("Kendinizi silemezsiniz"); setDeleteModal({ open: true, data: p }); }} title="Sil"><TrashIcon /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          <hr className="divider"/>

          {/* 3. İLETİŞİM FORMLARI */}
          <section className="personnel-section-wrapper">
            <div className="section-header" onClick={() => toggleSection('contact')}>
              <h3>3. İletişim Formları</h3>
              <BlueArrowIcon isOpen={sections.contact} />
            </div>
            {sections.contact && <div className="section-content-anim"><p className="action-info-box">Henüz mesaj yok.</p></div>}
          </section>

          <hr className="divider"/>

          {/* 4. İZİN TALEPLERİ */}
          <section className="personnel-section-wrapper">
            <div className="section-header" onClick={() => toggleSection('leaves')}>
              <h3>4. İzin Talepleri</h3>
              <BlueArrowIcon isOpen={sections.leaves} />
            </div>
            {sections.leaves && (
              <div className="section-content-anim">
                {isLeaveLoading ? <p>Yükleniyor...</p> : leaveRequests.length === 0 ? <p className="action-info-box">Bekleyen talep yok.</p> : (
                  <div className="table-responsive">
                    <table className="personnel-table" style={{width:'100%'}}>
                      <thead>
                        <tr><th>Personel</th><th>Tarih</th><th>Neden</th><th>Durum</th><th style={{textAlign:'center'}}>Onay</th></tr>
                      </thead>
                      <tbody>
                        {leaveRequests.map(req => (
                          <tr key={req.id} style={{opacity: req.status === 'PENDING' ? 1 : 0.6}}>
                            <td>{req.personnelFirstName} {req.personnelLastName} ({req.personnelRole})</td>
                            <td>{formatDateTime(req.startDate, req.startTime)} - {formatDateTime(req.endDate, req.endTime)}</td>
                            <td>{req.reason}</td>
                            <td style={{fontWeight:'bold', color: req.status === 'PENDING' ? '#e67700' : req.status === 'APPROVED' ? 'green' : 'red'}}>{req.status}</td>
                            <td style={{textAlign:'center'}}>
                              {req.status === 'PENDING' && <button onClick={() => handleApproveLeave(req.id)} style={{background:'#4ab43f', color:'white', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer'}}>Onayla</button>}
                              {req.status !== 'PENDING' && <span>-</span>}
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

          <hr className="divider"/>

          {/* 5. TEMİZLİK KONTROLÜ */}
          <section className="personnel-section-wrapper">
            <div className="section-header" onClick={() => toggleSection('cleaning')}>
              <h3>5. Temizlik Kontrolü</h3>
              <BlueArrowIcon isOpen={sections.cleaning} />
            </div>
            {sections.cleaning && <div className="section-content-anim"><p className="action-info-box">Rapor bulunamadı.</p></div>}
          </section>

        </div>
      </div>

      {/* --- MODALLAR --- */}

      {/* 1. KENDİ PROFİLİNİ DÜZENLEME MODALI */}
      {profileModal.open && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Bilgileri Güncelle</h3>
              <button onClick={() => setProfileModal({ open: false })} className="modal-close-btn"><CloseIcon /></button>
            </div>
            <form onSubmit={handleProfileUpdate} className="modal-form">
              {profileModal.field === 'password' ? (
                <>
                  <div className="modal-field"><label>Yeni Şifre</label><input type="password" value={profileModal.value} onChange={e => setProfileModal({ ...profileModal, value: e.target.value })} required /></div>
                  <div className="modal-field"><label>Tekrar</label><input type="password" value={profileModal.confirm} onChange={e => setProfileModal({ ...profileModal, confirm: e.target.value })} required /></div>
                </>
              ) : (
                <div className="modal-field"><label>Yeni Değer</label><input value={profileModal.value} onChange={e => setProfileModal({ ...profileModal, value: e.target.value })} required /></div>
              )}
              <div className="modal-actions"><button type="submit" className="save-btn">Güncelle</button></div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PERSONEL DÜZENLEME MODALI (BAŞKASI) */}
      {editPersonnelModal.open && editPersonnelModal.data && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Personel Düzenle</h3>
              <button onClick={() => setEditPersonnelModal({ open: false, data: null })} className="modal-close-btn"><CloseIcon /></button>
            </div>
            <form onSubmit={handlePersonnelEditSubmit} className="modal-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="modal-field"><label>Ad</label><input value={editPersonnelModal.data.firstName} onChange={e => setEditPersonnelModal({ ...editPersonnelModal, data: { ...editPersonnelModal.data, firstName: e.target.value } })} /></div>
                <div className="modal-field"><label>Soyad</label><input value={editPersonnelModal.data.lastName} onChange={e => setEditPersonnelModal({ ...editPersonnelModal, data: { ...editPersonnelModal.data, lastName: e.target.value } })} /></div>
              </div>
              <div className="modal-field"><label>Telefon</label><input value={editPersonnelModal.data.phoneNumber || ''} onChange={e => setEditPersonnelModal({ ...editPersonnelModal, data: { ...editPersonnelModal.data, phoneNumber: e.target.value } })} /></div>
              <div className="modal-field"><label>E-Posta</label><input value={editPersonnelModal.data.email || ''} onChange={e => setEditPersonnelModal({ ...editPersonnelModal, data: { ...editPersonnelModal.data, email: e.target.value } })} /></div>
              
              {/* 🔥 YENİ EKLENEN: ŞİFRE DEĞİŞTİRME ALANI */}
              <div className="modal-field" style={{backgroundColor: '#fef2f2', padding:'10px', borderRadius:'6px', border:'1px dashed #f87171'}}>
                <label style={{color:'#991b1b'}}>Yeni Şifre (Değiştirmek İçin Doldurun)</label>
                <input 
                    type="password" 
                    placeholder="Boş bırakırsanız eski şifre kalır" 
                    value={editPersonnelModal.data.password || ''} 
                    onChange={e => setEditPersonnelModal({ ...editPersonnelModal, data: { ...editPersonnelModal.data, password: e.target.value } })} 
                />
              </div>

              {editPersonnelModal.data.role === 'DOCTOR' && (
                <div className="modal-field"><label style={{ color: '#c1272d' }}>Uzmanlık</label><input value={editPersonnelModal.data.specialization || ''} onChange={e => setEditPersonnelModal({ ...editPersonnelModal, data: { ...editPersonnelModal.data, specialization: e.target.value } })} /></div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={() => setEditPersonnelModal({ open: false, data: null })} className="cancel-btn">İptal</button>
                <button type="submit" className="save-btn">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SİLME ONAY MODALI */}
      {deleteModal.open && deleteModal.data && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: '#c1272d' }}>Silmek İstediğinize Emin misiniz?</h3>
            <p><strong>{deleteModal.data.firstName} {deleteModal.data.lastName}</strong> silinecek.</p>
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button onClick={() => setDeleteModal({ open: false, data: null })} className="cancel-btn">Vazgeç</button>
              <button onClick={handleDeleteConfirm} className="delete-confirm-btn">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}