import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../../context/StaffAuthContext';

export default function DoctorPanel() {
  const { logoutStaff } = useStaffAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutStaff();
    navigate('/personelLogin', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Doktor Paneli</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Güvenli Çıkış</button>
      </div>
      <div style={styles.content}>
        <h1>Hoş Geldiniz, Sayın Hekimim.</h1>
        <p>Buradan hasta listesini, randevuları ve reçete işlemlerini yönetebilirsiniz.</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px' },
  logoutBtn: { backgroundColor: '#c1272d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  content: { marginTop: '40px', textAlign: 'center', color: '#0e2b4b' }
};