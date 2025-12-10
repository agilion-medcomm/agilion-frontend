import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function DoctorDisplayPage() {
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
    if (token) {
      sessionStorage.setItem('personnelSessionActive', 'true');
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
      console.log('User from API:', user);
      
      if (user) {
        setDoctorName(`${user.firstName || ''} ${user.lastName || ''}`);
        setDepartment(user.department || '');
      }

      // Doktorun bugünkü randevularını al
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
      
      console.log('Fetching appointments for doctorId:', user?.doctorId, 'date:', formattedDate);
      
      const res = await axios.get(`${BaseURL}/appointments`, {
        params: { 
          list: 'true',
          doctorId: user?.doctorId 
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('All appointments:', res.data?.data);

      // Sadece bugünün randevularını ve APPROVED olanları filtrele
      const allAppointments = res.data?.data || [];
      const todayAppointments = allAppointments.filter(apt => {
        console.log('Checking apt:', apt.date, 'vs', formattedDate, 'status:', apt.status);
        return apt.date === formattedDate && apt.status === 'APPROVED';
      });

      console.log('Today appointments:', todayAppointments);

      // Saate göre sırala
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

  // Şu anki saati dakika cinsinden hesapla
  const getCurrentMinutes = () => {
    return currentTime.getHours() * 60 + currentTime.getMinutes();
  };

  // Randevu saatini dakika cinsine çevir
  const getAppointmentMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Güncel randevuyu bul
  // Mantık: Randevu saati şu andan en fazla 30 dk önce başlamış ve henüz bitmemişse "güncel"
  // Randevu süresi varsayılan 30 dakika
  const findCurrentAppointmentIndex = () => {
    const nowMinutes = getCurrentMinutes();
    
    for (let i = 0; i < appointments.length; i++) {
      const aptMinutes = getAppointmentMinutes(appointments[i].time);
      const aptEndMinutes = aptMinutes + 30; // Randevu bitiş saati (30 dk sonra)
      
      // Randevu şu an aktif mi? (başlamış ama henüz bitmemiş)
      if (nowMinutes >= aptMinutes && nowMinutes < aptEndMinutes) {
        return i;
      }
      
      // Randevu henüz başlamamış mı? (gelecekte)
      if (aptMinutes > nowMinutes) {
        return i; // İlk gelecek randevu
      }
    }
    
    // Tüm randevular geçmişte, -1 döndür (hiçbiri güncel değil)
    return -1;
  };

  const currentIndex = findCurrentAppointmentIndex();

  // Gösterilecek randevuları belirle: 3 önceki + güncel + 5 sonraki
  const getDisplayAppointments = () => {
    if (appointments.length === 0) return [];

    const nowMinutes = getCurrentMinutes();
    
    // Eğer hiç güncel/gelecek randevu yoksa, son randevuları göster
    const centerIndex = currentIndex >= 0 ? currentIndex : appointments.length - 1;
    const startIndex = Math.max(0, centerIndex - 3);
    const endIndex = Math.min(appointments.length, centerIndex + 6);
    
    return appointments.slice(startIndex, endIndex).map((apt) => {
      const aptMinutes = getAppointmentMinutes(apt.time);
      const aptEndMinutes = aptMinutes + 30;
      
      let status = 'upcoming'; // beyaz - henüz gelmemiş
      
      if (nowMinutes >= aptEndMinutes) {
        // Randevu bitti (30 dk geçti)
        status = 'past'; // gri
      } else if (nowMinutes >= aptMinutes && nowMinutes < aptEndMinutes) {
        // Randevu şu an aktif
        status = 'current'; // yeşil
      }
      // else: henüz başlamamış = upcoming (beyaz)
      
      return { ...apt, displayStatus: status };
    });
  };

  const displayAppointments = getDisplayAppointments();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <span style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</span>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>Oturum Bulunamadı</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Bu sayfayı görüntülemek için önce doktor paneline giriş yapmalısınız.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '20px' }}>
            Doktor panelinden "Randevuları Yansıt" butonuna tıklayarak bu sayfayı açabilirsiniz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.hospitalLogo}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c1272d" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div style={styles.headerInfo}>
          <h1 style={styles.doctorName}>Dr. {doctorName}</h1>
          <p style={styles.department}>{department}</p>
        </div>
        <div style={styles.clockSection}>
          <div style={styles.clock}>
            {currentTime.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={styles.date}>
            {currentTime.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div style={styles.appointmentsList}>
        {displayAppointments.length === 0 ? (
          <div style={styles.noAppointments}>
            <span style={{ fontSize: '64px', marginBottom: '20px' }}>📅</span>
            <h2>Bugün için randevu bulunmamaktadır</h2>
          </div>
        ) : (
          displayAppointments.map((apt) => (
            <div 
              key={apt.id} 
              style={{
                ...styles.appointmentCard,
                ...getCardStyle(apt.displayStatus)
              }}
            >
              <div style={styles.timeSection}>
                <span style={{
                  ...styles.time,
                  color: apt.displayStatus === 'current' ? '#166534' : 
                         apt.displayStatus === 'past' ? '#6b7280' : '#1f2937'
                }}>
                  {apt.time}
                </span>
              </div>
              <div style={styles.patientSection}>
                <span style={{
                  ...styles.patientName,
                  color: apt.displayStatus === 'current' ? '#166534' : 
                         apt.displayStatus === 'past' ? '#6b7280' : '#1f2937'
                }}>
                  {apt.patientFirstName} {apt.patientLastName}
                </span>
              </div>
              {apt.displayStatus === 'current' && (
                <div style={styles.currentBadge}>
                  <span style={styles.pulsingDot}></span>
                  SIRADA
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p>🏥 AgilionMed Hastanesi</p>
        <p style={{ fontSize: '14px', opacity: 0.7 }}>Lütfen sıranızı bekleyiniz</p>
      </div>

      {/* CSS Animation for pulsing dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

const getCardStyle = (status) => {
  switch (status) {
    case 'current':
      return {
        backgroundColor: '#dcfce7',
        borderLeft: '6px solid #22c55e',
        transform: 'scale(1.02)',
        boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)'
      };
    case 'past':
      return {
        backgroundColor: '#f3f4f6',
        borderLeft: '6px solid #9ca3af',
        opacity: 0.7
      };
    default: // upcoming
      return {
        backgroundColor: '#ffffff',
        borderLeft: '6px solid #3b82f6'
      };
  }
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
    padding: '30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: 'white',
    fontSize: '24px'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: '20px',
    padding: '25px 40px',
    marginBottom: '30px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
  },
  hospitalLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '70px',
    height: '70px',
    backgroundColor: '#fef2f2',
    borderRadius: '50%'
  },
  headerInfo: {
    flex: 1,
    marginLeft: '30px'
  },
  doctorName: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e3a5f'
  },
  department: {
    margin: '5px 0 0 0',
    fontSize: '18px',
    color: '#64748b'
  },
  clockSection: {
    textAlign: 'right'
  },
  clock: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#1e3a5f',
    fontFamily: "'Courier New', monospace"
  },
  date: {
    fontSize: '16px',
    color: '#64748b',
    marginTop: '5px'
  },
  appointmentsList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    overflowY: 'auto',
    paddingRight: '10px'
  },
  noAppointments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    color: 'white',
    textAlign: 'center'
  },
  appointmentCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '25px 35px',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  timeSection: {
    minWidth: '120px'
  },
  time: {
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: "'Courier New', monospace"
  },
  patientSection: {
    flex: 1,
    marginLeft: '30px'
  },
  patientName: {
    fontSize: '24px',
    fontWeight: '600'
  },
  currentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  pulsingDot: {
    width: '12px',
    height: '12px',
    backgroundColor: 'white',
    borderRadius: '50%',
    animation: 'pulse 1.5s ease-in-out infinite'
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.8)',
    padding: '25px',
    fontSize: '18px',
    marginTop: '20px'
  }
};
