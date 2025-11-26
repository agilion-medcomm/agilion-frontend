import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../../context/PersonnelAuthContext';

export default function CleanerPanel() {
  const { logoutPersonnel } = usePersonnelAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutPersonnel();
    navigate('/personelLogin', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Temizlik Personeli Paneli</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Güvenli Çıkış</button>
      </div>
      <div style={styles.content}>
        <h1>Görev Listesi</h1>
        <p>Kat temizlik durumları ve acil çağrılar.</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#fffbeb', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #fde68a', paddingBottom: '20px' },
  logoutBtn: { backgroundColor: '#d97706', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  content: { marginTop: '40px', textAlign: 'center', color: '#b45309' }
};