// src/components/pages/panels/AdminPanel.jsx (GÜNCEL VE TAM KOD)

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../../context/StaffAuthContext';
import "./AdminPanelPage.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// İkonlar (Daha kısa olması için atlanmıştır, orijinal kodunuzdaki gibi kalmalıdır)
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export default function AdminPanelPage() {
  const navigate = useNavigate();
  const { user, logoutStaff, loginStaff } = useStaffAuth();
  const [staffList, setStaffList] = useState([]);
  
  // --- AKORDİYON STATE'LERİ ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStaffList, setShowStaffList] = useState(false);
  const [showContactForms, setShowContactForms] = useState(false);
  const [showLeaveRequests, setShowLeaveRequests] = useState(false);
  const [showCleaningChecks, setShowCleaningChecks] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editValueConfirm, setEditValueConfirm] = useState("");

  // Silme Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  const [form, setForm] = useState({
    tckn: "", firstName: "", lastName: "", password: "", role: "DOCTOR",
    phoneNumber: "", email: "", dateOfBirth: "", specialization: ""
  });
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔥 YÜKLEME DÜZELTMESİ: Kullanıcı bilgisi gelene kadar bekle
  if (user === undefined) { 
    return <div style={{textAlign: 'center', padding: '100px', fontSize: '20px'}}>Kullanıcı Bilgileri Yükleniyor...</div>
  }
  
  // ROL KONTROLÜ
  if (!user || user.role !== 'ADMIN') {
    return (
      <div style={{textAlign: 'center', padding: '100px', fontSize: '20px', color: '#c1272d', fontWeight: 'bold'}}>
        Yetkiniz yok veya oturum sona erdi. Lütfen tekrar <a href="/personelLogin" style={{color: '#0e2b4b'}}>giriş yapın</a>.
      </div>
    );
  }

  useEffect(() => { 
    if (user && user.role === 'ADMIN') {
        fetchStaff(); 
    }
  }, [user]);

  async function fetchStaff() {
    const token = localStorage.getItem('staffToken');
    if (!token) return;
    try {
      const res = await axios.get(`${BaseURL}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) { console.error(err); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setMessage("");
    const token = localStorage.getItem('staffToken');
    if (!token) return;
    
    const dataToSend = { ...form };
    if (dataToSend.role !== 'DOCTOR') dataToSend.specialization = "";

    try {
      await axios.post(`${BaseURL}/staff`, dataToSend, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Başarıyla eklendi.");
      setForm({ tckn: "", firstName: "", lastName: "", password: "", role: "DOCTOR", phoneNumber: "", email: "", dateOfBirth: "", specialization: "" });
      fetchStaff();
    } catch (err) { setError(err.response?.data?.message || "Bir hata oluştu."); }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLogout() {
    logoutStaff();
    navigate('/personelLogin', { replace: true });
  }

  // --- DÜZENLEME ---
  const openEditModal = (field) => {
    setEditField(field);
    setEditValue("");
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
    const token = localStorage.getItem('staffToken');

    if (editField === 'password') {
      if (editValue.length < 8) return setError("Şifre en az 8 karakter olmalıdır.");
      if (editValue !== editValueConfirm) return setError("Şifreler uyuşmuyor!");
    }

    const updateData = {};
    if (editField === 'email') updateData.email = editValue;
    if (editField === 'phone') updateData.phoneNumber = editValue;
    if (editField === 'password') updateData.password = editValue;

    try {
      await axios.put(`${BaseURL}/staff/${user.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loginStaff(token); 
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
      default: return 'Düzenle';
    }
  };

  // --- SİLME ---
  const handleDeleteClick = (staffMember) => {
    if (staffMember.id === user.id) {
      alert("Kendi hesabınızı buradan silemezsiniz!");
      return;
    }
    setStaffToDelete(staffMember);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    const token = localStorage.getItem('staffToken');

    try {
      await axios.delete(`${BaseURL}/staff/${staffToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
      setMessage("Personel başarıyla silindi.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Silme işlemi başarısız.");
    }
  };

  return (
    <div className="admin-page-wrapper">
      
      <div className="admin-top-section">
        <div className="admin-inner-container">
          <div className="panel-top-header">
            <h2 className="admin-panel-title">Yönetici Paneli</h2>
            <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
          </div>
          <section className="admin-profile-card">
            <div className="profile-header-strip">Personel Bilgileri</div>
            <div className="profile-content">
              <div className="profile-avatar-section">
                {user.photoUrl ? <img src={user.photoUrl} alt="Profil" className="avatar-img" /> : <div className="avatar-placeholder"><span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span></div>}
                <span className="avatar-label">Personel Fotosu</span>
              </div>
              <div className="profile-details-grid">
                <div className="profile-item"><span className="label">Adı:</span><span className="value-box readonly">{user.firstName}</span></div>
                <div className="profile-item"><span className="label">Soyadı:</span><span className="value-box readonly">{user.lastName}</span></div>
                <div className="profile-item"><span className="label">E-Posta:</span><div className="value-container"><span className="value-box">{user.email || "-"}</span><button className="edit-icon-btn" onClick={() => openEditModal('email')}><EditIcon /></button></div></div>
                <div className="profile-item"><span className="label">Telefon:</span><div className="value-container"><span className="value-box">{user.phoneNumber || "-"}</span><button className="edit-icon-btn" onClick={() => openEditModal('phone')}><EditIcon /></button></div></div>
                <div className="profile-item" style={{ gridColumn: '1 / -1' }}><span className="label">Görevi:</span><span className="value-box readonly" style={{fontWeight: 'bold', color: '#c1272d'}}>{user.role} <span style={{color:'#555', fontWeight:'normal', fontSize:'0.9em', marginLeft:'8px'}}>(Personel No: {user.id})</span></span></div>
                <div className="profile-item"><span className="label">TC Kimlik:</span><span className="value-box readonly">{user.tckn}</span></div>
                <div className="profile-item"><span className="label">Şifre:</span><div className="value-container"><span className="value-box">********</span><button className="edit-icon-btn" onClick={() => openEditModal('password')}><EditIcon /></button></div></div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODALLAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header"><h3>{getModalTitle()}</h3><button onClick={closeEditModal} className="modal-close-btn"><CloseIcon /></button></div>
            <form onSubmit={handleUpdateSubmit} className="modal-form">
              {editField === 'password' ? (
                <>
                  <div className="modal-field"><label>Yeni Şifre</label><input type="password" value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="En az 8 karakter" required /></div>
                  <div className="modal-field"><label>Yeni Şifre (Tekrar)</label><input type="password" value={editValueConfirm} onChange={(e) => setEditValueConfirm(e.target.value)} placeholder="Şifreyi tekrar girin" required /></div>
                </>
              ) : (
                <div className="modal-field"><label>Yeni Değer</label><input type={editField === 'email' ? 'email' : 'text'} value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder={editField === 'phone' ? "0555..." : "ornek@mail.com"} required /></div>
              )}
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-actions"><button type="button" onClick={closeEditModal} className="cancel-btn">İptal</button><button type="submit" className="save-btn">Güncelle</button></div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && staffToDelete && (
        <div className="modal-overlay">
          <div className="modal-box" style={{maxWidth: '450px'}}>
            <div className="modal-header"><h3 style={{color: '#c1272d'}}>Personel Silinecek</h3><button onClick={() => setIsDeleteModalOpen(false)} className="modal-close-btn"><CloseIcon /></button></div>
            <div className="delete-modal-content">
              <p>Aşağıdaki personeli silmek üzeresiniz. Bu işlem geri alınamaz.</p>
              <div className="delete-info-box">
                <p><strong>Ad Soyad:</strong> {staffToDelete.firstName} {staffToDelete.lastName}</p>
                <p><strong>Görevi:</strong> {staffToDelete.role}</p>
                <p><strong>TCKN:</strong> {staffToDelete.tckn}</p>
              </div>
              <p style={{marginTop: '15px', fontSize: '0.9rem'}}>Onaylıyor musunuz?</p>
            </div>
            <div className="modal-actions"><button onClick={() => setIsDeleteModalOpen(false)} className="cancel-btn">Vazgeç</button><button onClick={confirmDelete} className="delete-confirm-btn">Sil</button></div>
          </div>
        </div>
      )}

      <div className="admin-bottom-section">
        <div className="admin-inner-container">
          
          {/* 1. YENİ PERSONEL EKLE */}
          <section className="staff-section-wrapper">
            <div className="section-header" onClick={() => setShowAddForm(!showAddForm)}>
              <h3>Yeni Personel Ekle</h3>
              <BlueArrowIcon isOpen={showAddForm} />
            </div>
            {showAddForm && (
              <div className="section-content-anim">
                <form className="staff-add-form" onSubmit={handleSubmit}>
                   <div className="form-group-full">
                    <label style={{fontSize:'0.9rem', fontWeight:'600', color:'#444', marginBottom:'4px', display:'block'}}>Personel Türü</label>
                    <select name="role" value={form.role} onChange={handleChange} style={{fontWeight:'bold', color:'#c1272d'}}>
                      <option value="DOCTOR">Doktor</option><option value="LAB_TECHNICIAN">Laborant</option><option value="CASHIER">Vezne</option><option value="CLEANER">Temizlik Personeli</option><option value="ADMIN">Yönetici (Admin)</option>
                    </select>
                  </div>
                  <input name="tckn" maxLength={11} minLength={11} required placeholder="TC Kimlik No" value={form.tckn} onChange={handleChange} />
                  <input name="firstName" required placeholder="Ad" value={form.firstName} onChange={handleChange} />
                  <input name="lastName" required placeholder="Soyad" value={form.lastName} onChange={handleChange} />
                  <input name="password" minLength={8} required placeholder="Şifre" type="password" value={form.password} onChange={handleChange} />
                  <input name="phoneNumber" placeholder="Telefon" value={form.phoneNumber} onChange={handleChange} />
                  <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} />
                  <input name="dateOfBirth" type="date" placeholder="Doğum Tarihi" value={form.dateOfBirth} onChange={handleChange} />
                  {form.role === 'DOCTOR' && (<input name="specialization" placeholder="Uzmanlık Alanı" value={form.specialization} onChange={handleChange} style={{border:'1px solid #c1272d', backgroundColor:'#fff5f5'}} />)}
                  <button type="submit">Ekle</button>
                </form>
                {error && <div className="error-message status-message">{error}</div>}
                {message && <div className="success-message status-message">{message}</div>}
              </div>
            )}
          </section>

          <hr className="divider"/>

          {/* 2. MEVCUT PERSONELLER */}
          <section className="staff-section-wrapper">
             <div className="section-header" onClick={() => setShowStaffList(!showStaffList)}>
              <h3>Mevcut Personeller</h3>
              <BlueArrowIcon isOpen={showStaffList} />
            </div>
            {showStaffList && (
              <div className="section-content-anim">
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr><th>TCKN</th><th>Ad</th><th>Soyad</th><th>Rol</th><th>Telefon</th><th>E-posta</th><th style={{textAlign:'center'}}>İşlemler</th></tr>
                    </thead>
                    <tbody>
                      {staffList.map((staff) => (
                        <tr key={staff.id}>
                          <td>{staff.tckn}</td><td>{staff.firstName}</td><td>{staff.lastName}</td><td>{staff.role}</td><td>{staff.phoneNumber || '-'}</td><td>{staff.email || '-'}</td>
                          <td style={{textAlign:'center'}}><button className="delete-icon-btn" onClick={() => handleDeleteClick(staff)}><TrashIcon /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {staffList.length === 0 && <div style={{marginTop:'10px', color:'#666'}}>Henüz personel yok.</div>}
              </div>
            )}
          </section>

          <hr className="divider"/>

          {/* 3. İLETİŞİM FORMLARINI GÖRÜNTÜLEME (YENİ) */}
          <section className="staff-section-wrapper">
             <div className="section-header" onClick={() => setShowContactForms(!showContactForms)}>
              <h3>İletişim Formlarını Görüntüleme</h3>
              <BlueArrowIcon isOpen={showContactForms} />
            </div>
            {showContactForms && (
              <div className="section-content-anim">
                <p style={{ color: '#666', padding: '10px', background: '#f9fafb', borderRadius:'8px' }}>
                  <i>Bu özellik henüz aktif değil. (İletişim formları burada listelenecek)</i>
                </p>
              </div>
            )}
          </section>

          <hr className="divider"/>

          {/* 4. İZİN TALEPLERİ (YENİ) */}
          <section className="staff-section-wrapper">
             <div className="section-header" onClick={() => setShowLeaveRequests(!showLeaveRequests)}>
              <h3>İzin Talepleri</h3>
              <BlueArrowIcon isOpen={showLeaveRequests} />
            </div>
            {showLeaveRequests && (
              <div className="section-content-anim">
                <p style={{ color: '#666', padding: '10px', background: '#f9fafb', borderRadius:'8px' }}>
                  <i>Bu özellik henüz aktif değil. (Personel izin talepleri burada yönetilecek)</i>
                </p>
              </div>
            )}
          </section>

          <hr className="divider"/>

          {/* 5. TEMİZLİK KONTROLÜ (YENİ) */}
          <section className="staff-section-wrapper">
             <div className="section-header" onClick={() => setShowCleaningChecks(!showCleaningChecks)}>
              <h3>Temizlik Kontrolü</h3>
              <BlueArrowIcon isOpen={showCleaningChecks} />
            </div>
            {showCleaningChecks && (
              <div className="section-content-anim">
                 <p style={{ color: '#666', padding: '10px', background: '#f9fafb', borderRadius:'8px' }}>
                  <i>Bu özellik henüz aktif değil. (Temizlik denetim raporları burada görüntülenecek)</i>
                </p>
              </div>
            )}
          </section>

        </div>
      </div>

    </div>
  );
}