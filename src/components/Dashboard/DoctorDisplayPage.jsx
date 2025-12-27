import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const BaseURL = `${API_BASE}/api/v1`;

export default function DoctorDisplayPage() {
  // Read theme directly from localStorage on mount to ensure new tab inherits correct theme
  const [isDark, setIsDark] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark';
  });

  // Also sync with context if it updates
  const { theme } = useTheme();

  useEffect(() => {
    // Update isDark when context theme changes
    setIsDark(theme === 'dark');
  }, [theme]);

  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState('');
  const [department, setDepartment] = useState('');
  const [authError, setAuthError] = useState(false);

  // Sayfa açıldığında localStorage'dan token varsa sessionStorage'ı da ayarla
  // Bu sayede yeni sekmede context token'ı silmeyecek
  useEffect(() => {
    const token = localStorage.getItem('personnelToken');
    const storedUser = localStorage.getItem('personnelUser');

    if (token) {
      sessionStorage.setItem('personnelSessionActive', 'true');
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userData = user.user || user;
        setDoctorName(`${userData.firstName || ''} ${userData.lastName || ''}`);
        setDepartment(userData.department || '');
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, []);

  // Her dakika güncelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      fetchAppointments();
    }, 60000); // 1 dakikada bir güncelle

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const token = localStorage.getItem('personnelToken');

    if (!token) {
      setAuthError(true);
      setLoading(false);
      return;
    }

    try {
      // Backend'den kullanıcı bilgisini al
      const userRes = await axios.get(`${BaseURL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const user = userRes.data?.data || userRes.data;

      if (user) {
        const userData = user.user || user;
        setDoctorName(`${userData.firstName || ''} ${userData.lastName || ''}`);
        setDepartment(userData.department || '');
      }

      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;

      const res = await axios.get(`${BaseURL}/appointments`, {
        params: {
          list: 'true',
          doctorId: user?.doctorId
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      const allAppointments = res.data?.data || [];
      const todayAppointments = allAppointments.filter(apt => {
        return apt.date === formattedDate && apt.status === 'APPROVED';
      });

      todayAppointments.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });

      setAppointments(todayAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        setAuthError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMinutes = () => {
    return currentTime.getHours() * 60 + currentTime.getMinutes();
  };

  const getAppointmentMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const findCurrentAppointmentIndex = () => {
    const nowMinutes = getCurrentMinutes();
    for (let i = 0; i < appointments.length; i++) {
      const aptMinutes = getAppointmentMinutes(appointments[i].time);
      const aptEndMinutes = aptMinutes + 30;
      if (nowMinutes >= aptMinutes && nowMinutes < aptEndMinutes) return i;
      if (aptMinutes > nowMinutes) return i;
    }
    return -1;
  };

  const currentIndex = findCurrentAppointmentIndex();

  const getCardStyle = (status) => {
    switch (status) {
      case 'current':
        return {
          background: isDark
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderLeft: isDark ? '6px solid #34d399' : '6px solid #14532d',
          transform: 'scale(1.02)',
          boxShadow: isDark
            ? '0 10px 40px rgba(16, 185, 129, 0.4)'
            : '0 10px 30px rgba(34, 197, 94, 0.3)',
          border: 'none',
          color: 'white'
        };
      case 'past':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
          borderLeft: isDark ? '6px solid rgba(255, 255, 255, 0.2)' : '6px solid #94a3b8',
          opacity: 0.5,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0'
        };
      default: // upcoming
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#ffffff',
          borderLeft: '6px solid #3b82f6',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
          boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        };
    }
  };

  const pageStyles = {
    container: {
      minHeight: '100vh',
      background: isDark
        ? 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)'
        : 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '30px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease'
    },
    loading: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: isDark ? 'white' : '#1e3a5f',
      fontSize: '24px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? 'rgba(30, 58, 95, 0.6)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '25px 40px',
      marginBottom: '30px',
      boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(30, 58, 95, 0.05)'
    },
    hospitalLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '70px',
      height: '70px',
      backgroundColor: isDark ? 'rgba(193, 39, 45, 0.1)' : '#fef2f2',
      borderRadius: '50%',
      border: isDark ? '1px solid rgba(193, 39, 45, 0.3)' : 'none'
    },
    headerInfo: { flex: 1, marginLeft: '30px' },
    doctorName: { margin: 0, fontSize: '32px', fontWeight: '700', color: isDark ? '#ffffff' : '#1e3a5f' },
    department: { margin: '5px 0 0 0', fontSize: '18px', color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#64748b' },
    clockSection: { textAlign: 'right' },
    clock: { fontSize: '48px', fontWeight: '700', color: isDark ? '#ffffff' : '#1e3a5f', fontFamily: "'Courier New', monospace" },
    date: { fontSize: '16px', color: isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748b', marginTop: '5px' },
    appointmentsList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' },
    noAppointments: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: isDark ? 'white' : '#1e3a5f', textAlign: 'center' },
    appointmentCard: { display: 'flex', alignItems: 'center', padding: '28px 40px', borderRadius: '20px', transition: 'all 0.3s ease' },
    time: { fontSize: '32px', fontWeight: '700', minWidth: '120px', fontFamily: "'Courier New', monospace" },
    patientName: { fontSize: '28px', fontWeight: '600', flex: 1, marginLeft: '40px' },
    currentBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.25)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '40px',
      fontSize: '18px',
      fontWeight: '800',
      letterSpacing: '1px'
    },
    footer: { textAlign: 'center', padding: '30px', borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(30, 58, 95, 0.05)', marginTop: '20px' },
    footerHost: { margin: 0, fontSize: '20px', fontWeight: '600', color: isDark ? '#ffffff' : '#1e3a5f', opacity: 0.9 },
    footerWait: { margin: '8px 0 0 0', fontSize: '16px', color: isDark ? 'rgba(255,255,255,0.6)' : '#64748b', fontWeight: '500' }
  };

  const getDisplayAppointments = () => {
    if (appointments.length === 0) return [];
    const nowMinutes = getCurrentMinutes();
    const centerIndex = currentIndex >= 0 ? currentIndex : appointments.length - 1;
    const startIndex = Math.max(0, centerIndex - 3);
    const endIndex = Math.min(appointments.length, centerIndex + 6);
    return appointments.slice(startIndex, endIndex).map((apt) => {
      const aptMinutes = getAppointmentMinutes(apt.time);
      const aptEndMinutes = aptMinutes + 30;
      let status = 'upcoming';
      if (nowMinutes >= aptEndMinutes) status = 'past';
      else if (nowMinutes >= aptMinutes && nowMinutes < aptEndMinutes) status = 'current';
      return { ...apt, displayStatus: status };
    });
  };

  const displayAppointments = getDisplayAppointments();

  if (loading) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.loading}>
          <div className="spinner"></div>
          <p style={{ marginTop: '20px' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.loading}>
          <span style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</span>
          <h2 style={{ color: isDark ? 'white' : '#1e3a5f', marginBottom: '10px' }}>Oturum Bulunamadı</h2>
          <p style={{ color: isDark ? 'rgba(255,255,255,0.7)' : '#64748b' }}>Bu sayfayı görüntülemek için lütfen doktor panelinden tekrar giriş yapın.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.container} data-theme={isDark ? 'dark' : 'light'}>
      <div style={pageStyles.header}>
        <div style={pageStyles.hospitalLogo}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c1272d" strokeWidth="2.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div style={pageStyles.headerInfo}>
          <h1 style={pageStyles.doctorName}>Dr. {doctorName}</h1>
          <p style={pageStyles.department}>{department}</p>
        </div>
        <div style={pageStyles.clockSection}>
          <div style={pageStyles.clock}>{currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
          <div style={pageStyles.date}>{currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div style={pageStyles.appointmentsList}>
        {displayAppointments.length === 0 ? (
          <div style={pageStyles.noAppointments}>
            <span style={{ fontSize: '80px', marginBottom: '24px' }}></span>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: isDark ? '#ffffff' : '#1e3a5f' }}>Bugün için randevu bulunmamaktadır</h2>
          </div>
        ) : (
          displayAppointments.map((apt) => (
            <div key={apt.id} style={{ ...pageStyles.appointmentCard, ...getCardStyle(apt.displayStatus) }}>
              <span style={{ ...pageStyles.time, color: apt.displayStatus === 'current' ? '#ffffff' : apt.displayStatus === 'past' ? (isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8') : (isDark ? '#f8fafc' : '#1e3a5f') }}>{apt.time}</span>
              <span style={{ ...pageStyles.patientName, color: apt.displayStatus === 'current' ? '#ffffff' : apt.displayStatus === 'past' ? (isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8') : (isDark ? '#f8fafc' : '#1e3a5f') }}>{apt.patientFirstName} {apt.patientLastName}</span>
              {apt.displayStatus === 'current' && <div style={pageStyles.currentBadge}><div className="pulsing-dot-white"></div>SIRADA</div>}
            </div>
          ))
        )}
      </div>

      <div style={pageStyles.footer}>
        <p style={pageStyles.footerHost}>Zeytinburnu Cerrahi Tıp Merkezi</p>
        <p style={pageStyles.footerWait}>Lütfen sıranızı bekleyiniz</p>
      </div>

      <style>{`
        .spinner { width: 60px; height: 60px; border: 4px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(30, 58, 95, 0.1)'}; border-top: 4px solid ${isDark ? '#ffffff' : '#3b82f6'}; border-radius: 50%; animation: spin 1s linear infinite; }
        .pulsing-dot-white { width: 12px; height: 12px; background-color: white; border-radius: 50%; animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; border-radius: 10px; }
      `}</style>
    </div>
  );
}
