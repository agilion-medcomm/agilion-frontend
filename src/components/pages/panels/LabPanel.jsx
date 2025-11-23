import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../../../context/StaffAuthContext';

export default function LabPanel() {
  const { logoutStaff } = useStaffAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutStaff();
    navigate('/personelLogin', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Laboratuvar Paneli</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Güvenli Çıkış</button>
      </div>
      <div style={styles.content}>
        <h1>Numune ve Sonuç Ekranı</h1>
        <p>Test sonuçlarını buradan girebilirsiniz.</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f0f9ff', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #bae6fd', paddingBottom: '20px' },
  logoutBtn: { backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  content: { marginTop: '40px', textAlign: 'center', color: '#0369a1' }
};