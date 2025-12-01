import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './ProfilePage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const BaseURL = `${API_BASE}/api/v1`;

// --- İKONLAR ---
const SaveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
const UserIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const MailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

export default function ProfilePage() {
    const { user, loginPersonnel } = usePersonnelAuth();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        phoneNumber: '',
        specialization: '',
    });

    // Password State
    const [passData, setPassData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                specialization: user.specialization || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePassChange = (e) => {
        const { name, value } = e.target;
        setPassData(prev => ({ ...prev, [name]: value }));
    };

    // --- 1. PROFİL GÜNCELLEME ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const token = localStorage.getItem('personnelToken') || localStorage.getItem('token');
            if (!token) {
                throw new Error("Oturum süreniz dolmuş veya giriş yapılmamış.");
            }
            // DİKKAT: Burada personel tablosunun id'si kullanılmalı! (ör: doctor.id, admin.id)
            // user.personnelId, user.doctorId, user.adminId gibi bir alan backend'den gelmeli ve burada kullanılmalı.
            // Eğer user objesinde personnelId yoksa, backend'den /auth/me veya ilgili endpoint ile bu id'yi çekmelisiniz.
            const targetId = user.personnelId || user.doctorId || user.adminId || user.id; // Sıralamayı ihtiyaca göre güncelleyin
            await axios.put(`${BaseURL}/personnel/${targetId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Context güncelleme (opsiyonel)
            if (loginPersonnel) {
                const updatedUser = { ...user, ...formData };
                loginPersonnel(token, updatedUser);
            }

            setSuccessMsg('Profil bilgileriniz başarıyla güncellendi.');
        } catch (err) {
            console.error("Profil güncelleme hatası:", err);
            setErrorMsg(err.response?.data?.message || err.message || 'Güncelleme başarısız.');
        } finally {
            setLoading(false);
        }
    };

    // --- 2. ŞİFRE GÜNCELLEME ---
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!user) return;

        if (passData.newPassword !== passData.confirmPassword) {
            setErrorMsg('Şifreler birbiriyle uyuşmuyor.');
            return;
        }
        if (passData.newPassword.length < 6) {
            setErrorMsg('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            // DÜZELTME: Token kontrolü
            const token = localStorage.getItem('personnelToken') || localStorage.getItem('token');

            if (!token) {
                throw new Error("Oturum süreniz dolmuş veya giriş yapılmamış. Lütfen tekrar giriş yapın.");
            }

            // DİKKAT: Burada da personel tablosunun id'si kullanılmalı! (ör: doctor.id, admin.id)
            // user.personnelId, user.doctorId, user.adminId gibi bir alan backend'den gelmeli ve burada kullanılmalı.
            // Eğer user objesinde personnelId yoksa, backend'den /auth/me veya ilgili endpoint ile bu id'yi çekmelisiniz.
            const targetId = user.personnelId || user.doctorId || user.adminId || user.id; // Sıralamayı ihtiyaca göre güncelleyin

            console.log("Şifre güncelleme isteği gönderiliyor...", { targetId });

            await axios.put(`${BaseURL}/personnel/${targetId}`, { password: passData.newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccessMsg('Şifreniz başarıyla değiştirildi.');
            setPassData({ newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error("Şifre değiştirme hatası:", err);
            // Backend'den gelen özel mesajı göster, yoksa genel mesaj
            setErrorMsg(err.response?.data?.message || err.message || 'Şifre değiştirilemedi.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="profile-loading" style={{ padding: '2rem', textAlign: 'center' }}>Kullanıcı bilgileri yükleniyor...</div>;
    }

    return (
        <div className="profile-page-container">
            <div className="profile-header-section">
                <h1 className="page-title">Profil Ayarları</h1>
                <p className="page-subtitle">Hesap bilgilerinizi buradan yönetebilirsiniz.</p>
            </div>

            {successMsg && <div className="profile-alert success">{successMsg}</div>}
            {errorMsg && <div className="profile-alert error">{errorMsg}</div>}

            <div className="profile-grid">

                {/* SOL KOLON: KİMLİK KARTI */}
                <div className="profile-card identity-card">
                    <div className="card-header">
                        <div className="avatar-circle">
                            {user?.firstName?.charAt(0) || 'U'}{user?.lastName?.charAt(0) || ''}
                        </div>
                        <div className="user-identity">
                            <h2>{user?.firstName} {user?.lastName}</h2>
                            <span className="role-badge">{user?.role}</span>
                        </div>
                    </div>

                    <div className="card-body">
                        <div className="info-group">
                            <label>Personel ID</label>
                            <div className="info-value">#{user?.id}</div>
                        </div>
                        <div className="info-group">
                            <label>TC Kimlik No</label>
                            <div className="info-value">{user?.tckn}</div>
                        </div>
                        <div className="info-group">
                            <label>Departman</label>
                            <div className="info-value">{user?.departmentId || 'Genel'}</div>
                        </div>
                    </div>
                </div>

                {/* SAĞ KOLON */}
                <div className="profile-right-column">

                    {/* İLETİŞİM */}
                    <div className="profile-card settings-card">
                        <div className="card-title">
                            <UserIcon /> İletişim Bilgileri
                        </div>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label><MailIcon /> E-Posta</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><PhoneIcon /> Telefon</label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {user?.role === 'DOCTOR' && (
                                <div className="form-group" style={{ marginTop: '1rem' }}>
                                    <label>Uzmanlık Alanı</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        className="full-width"
                                    />
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="submit" className="save-btn" disabled={loading}>
                                    {loading ? 'Kaydediliyor...' : <><SaveIcon /> Kaydet</>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* ŞİFRE */}
                    <div className="profile-card security-card">
                        <div className="card-title">
                            <LockIcon /> Şifre Değiştir
                        </div>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Yeni Şifre</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passData.newPassword}
                                        onChange={handlePassChange}
                                        placeholder="******"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Şifre Tekrar</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passData.confirmPassword}
                                        onChange={handlePassChange}
                                        placeholder="******"
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="password-btn" disabled={loading || !passData.newPassword}>
                                    Şifreyi Güncelle
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}