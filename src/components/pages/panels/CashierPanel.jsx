import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../../context/PersonnelAuthContext';

export default function CashierPanel() {
  const { logoutPersonnel } = usePersonnelAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutPersonnel();
    navigate('/personelLogin', { replace: true });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Vezne Paneli</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Güvenli Çıkış</button>
      </div>
      <div style={styles.content}>
        <h1>Ödeme ve Fatura</h1>
        <p>Günlük kasa işlemleri ve hasta ödemeleri.</p>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f0fdf4', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #bbf7d0', paddingBottom: '20px' },
  logoutBtn: { backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  content: { marginTop: '40px', textAlign: 'center', color: '#15803d' }
};