<<<<<<< HEAD
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Appointment from '../Appointment/Appointment'; 
import './AppointmentPage.css'; // Temizlenmiş CSS dosyasını import et
=======
// src/components/pages/AppointmentPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { useAuth } from '../../context/AuthContext';
import '../Appointment/Appointment.css'; 

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

<<<<<<< HEAD
// --- Yardımcı Fonksiyonlar ---
=======
// --- Helper Functions ---
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
const SLOT_START = 9;
const SLOT_END = 17;
const MAX_DAYS = 90;

const getDays = (startDay) => {
    const dates = [];
    let currentDate = new Date(startDay);
    currentDate.setHours(0, 0, 0, 0); 
    for (let i = 0; i < MAX_DAYS; i++) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

const generateTimeSlots = (date, bookedSlots = []) => {
    const slots = [];
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    for (let h = SLOT_START; h <= SLOT_END; h++) {
        for (let m of [0, 30]) {
            if (h === SLOT_END && m > 0) continue; 
            
            const slotTime = new Date(date);
            slotTime.setHours(h, m, 0, 0);
            const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            
            const isPast = isToday && slotTime.getTime() < now.getTime();
<<<<<<< HEAD
=======
            // Backend'den gelen dolu saatler burada kontrol ediliyor
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
            const isBooked = bookedSlots.includes(timeStr); 

            slots.push({
                time: timeStr,
                isAvailable: !isPast && !isBooked,
            });
        }
    }
    return slots.filter(slot => slot.time !== '17:30'); 
};
>>>>>>> main

export default function AppointmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;
<<<<<<< HEAD

  if (!doctor) {
     return (
        <div className="appointment-page-wrapper" style={{alignItems:'center'}}>
           <div style={{textAlign:'center'}}>
                <h2 style={{color:'#c1272d', marginBottom:'20px'}}>Hata: Doktor Seçilmedi</h2>
                <button 
                    onClick={() => navigate('/hekimlerimiz')} 
                    style={{ padding:'12px 24px', background:'#0d6efd', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }}
                >
                    Hekimlerimiz Sayfasına Git
                </button>
           </div>
=======
  const { user } = useAuth(); 

  const initialDate = useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
  }, []);
  
  const allDays = useMemo(() => getDays(initialDate), [initialDate]);
  const minDate = initialDate;
  const maxDate = allDays[MAX_DAYS - 1];

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [weekStartIndex, setWeekStartIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
      if (!doctor) return;
      const dateStr = selectedDate.toLocaleDateString('tr-TR');
      
=======
  
  // O günün dolu saatlerini tutacak state
  const [bookedSlots, setBookedSlots] = useState([]);

  // Tarih değişince o günün dolu randevularını çek
  useEffect(() => {
      if (!doctor) return;

      const dateStr = selectedDate.toLocaleDateString('tr-TR'); // Örn: 24.11.2025
      // URL parametrelerinde tarih formatı encoding gerektirebilir ama basitçe query atıyoruz
      // Backend'deki tarih formatıyla buradaki aynı olmalı (Locale string sunucu/client farkı yaratabilir, dikkat)
      // En garantisi YYYY-MM-DD kullanmaktır ama şimdilik mevcut yapıyı koruyorum.
      
      // Basit fetch:
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
      fetch(`${API_BASE}/api/v1/appointments?doctorId=${doctor.id}&date=${dateStr}`)
        .then(res => res.json())
        .then(res => {
            if(res.status === 'success') {
<<<<<<< HEAD
                // Backend'den gelen veriyi al (dizi mi obje mi kontrol et)
                const slots = Array.isArray(res.data) ? res.data.map(a=>a.time) : (res.data.bookedTimes || []);
                setBookedSlots(slots);
=======
                // Gelen randevuların saatlerini alıp listeye koyuyoruz
                setBookedSlots(res.data.map(a => a.time));
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
            }
        })
        .catch(err => console.error("Dolu saatler çekilemedi:", err));

  }, [selectedDate, doctor]);

  const currentTimeSlots = useMemo(() => {
      return generateTimeSlots(selectedDate, bookedSlots);
<<<<<<< HEAD
  }, [selectedDate, bookedSlots]); 
=======
  }, [selectedDate, bookedSlots]); // bookedSlots değişince yeniden hesapla
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc

  const visibleWeekDays = allDays.slice(weekStartIndex, weekStartIndex + 5);

  const handleDateChangeFromCalendar = (date) => {
      if (date >= minDate && date <= maxDate) {
          setSelectedDate(date);
          setSelectedSlot(null);
          setCalendarVisible(false);
          const newIndex = allDays.findIndex(d => d.toDateString() === date.toDateString());
          if (newIndex !== -1) {
              setWeekStartIndex(Math.max(0, Math.min(newIndex - 2, MAX_DAYS - 5)));
          }
      } else {
          alert("Sadece bugünden itibaren 90 gün içinde randevu alabilirsiniz.");
      }
  };
  
  const handleDayCardClick = (date) => {
      setSelectedDate(date);
      setSelectedSlot(null);
  }

  const handleNextWeek = () => {
      if (weekStartIndex + 5 < MAX_DAYS) {
          setWeekStartIndex(prev => Math.min(prev + 5, MAX_DAYS - 5));
      }
  };

  const handlePrevWeek = () => {
      if (weekStartIndex > 0) {
          setWeekStartIndex(prev => Math.max(prev - 5, 0));
      }
  };
  
 const handleFinalAppointment = async () => {
      if (!selectedSlot) {
          alert("Lütfen bir randevu saati seçiniz.");
          return;
      }
      
      if (!user) {
          alert("Randevu oluşturmak için lütfen tekrar giriş yapınız.");
          navigate('/login');
          return;
      }

      setIsSubmitting(true);

<<<<<<< HEAD
=======
      // 🔥 GÜNCELLEME: İsim ve Soyisim ayrı gönderiliyor
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
      const appointmentPayload = {
          doctorId: doctor.id,
          doctorName: `${doctor.firstName} ${doctor.lastName}`,
          patientId: user.id || 999,
          patientFirstName: user.firstName || "Misafir",
          patientLastName: user.lastName || "Hasta",
          date: selectedDate.toLocaleDateString('tr-TR'), 
          time: selectedSlot,
<<<<<<< HEAD
          // 🔥 GÜNCELLEME: Doğrudan onaylı gönderiyoruz
          status: 'APPROVED' 
=======
          status: 'PENDING'
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
      };

      try {
          const response = await fetch(`${API_BASE}/api/v1/appointments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(appointmentPayload)
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || 'Randevu oluşturulamadı.');
          }
          
          if (data.status === 'success') {
<<<<<<< HEAD
              alert(`🎉 Randevunuz Başarıyla Oluşturuldu!\n\nSayın ${appointmentPayload.patientFirstName} ${appointmentPayload.patientLastName},\n${doctor.firstName} ${doctor.lastName} ile randevunuz ONAYLANMIŞTIR.`);
=======
              // Mesaj gösterirken birleştiriyoruz
              alert(`🎉 Randevunuz Başarıyla Kaydedildi!\n\nSayın ${appointmentPayload.patientFirstName} ${appointmentPayload.patientLastName},\n${doctor.firstName} ${doctor.lastName} ile randevunuz onaylanmıştır.`);
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
              navigate('/'); 
          }
      } catch (error) {
          alert("Hata: " + error.message);
<<<<<<< HEAD
=======
          setSelectedSlot(null);
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
      } finally {
          setIsSubmitting(false);
      }
  };

  if (!doctor) {
     return (
        <div style={{ minHeight: '60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', padding:'20px', textAlign:'center' }}>
           <h2 style={{color:'#c1272d'}}>Hata: Doktor Seçilmedi</h2>
           <button onClick={() => navigate('/hekimlerimiz')} style={{ padding:'12px 24px', background:'#0d6efd', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }}>
             Hekimlerimiz Sayfasına Git
           </button>
>>>>>>> main
        </div>
     );
  }

<<<<<<< HEAD
  return (
    <main className="appointment-page-wrapper">
      <div className="appointment-page-container">
         {/* Geri Dön Butonu */}
         <button onClick={() => navigate(-1)} className="back-link-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Geri Dön
         </button>

         {/* Randevu Bileşeni */}
         <Appointment 
            doctor={doctor} 
            onSuccess={() => navigate('/')} 
         />
=======
  const DoctorAvatar = () => {
      if (doctor.img) {
          return <img src={doctor.img} alt={`Dr. ${doctor.lastName}`} className="doctor-modal-img" />;
      }
      const initials = `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase();
      return <div className="doctor-modal-avatar-placeholder">{initials}</div>;
  };

  return (
    <main style={{ background: '#f7fafd', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
         <div style={{ marginBottom: '20px' }}>
            <button onClick={() => navigate(-1)} style={{ background:'transparent', border:'none', color:'#555', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', gap:'5px', fontWeight:'600' }}>
               &larr; Geri Dön
            </button>
         </div>

         <div className="appointment-modal" style={{ position:'static', transform:'none', width:'100%', maxWidth:'100%', padding:'30px', margin:'0 auto', boxShadow:'0 10px 30px rgba(0,0,0,0.08)' }}>
             <div className="modal-content-grid">
                <div className="doctor-panel-left">
                    <h2 className="doctor-name">{doctor.firstName} {doctor.lastName}</h2>
                    <p className="doctor-specialization">{doctor.specialization || 'Genel Hekim'}</p>
                    <DoctorAvatar />
                    <div className="randevu-onay-wrap">
                        <button 
                            className="confirm-appointment-btn" 
                            onClick={handleFinalAppointment}
                            disabled={!selectedSlot || isSubmitting}
                            style={{ opacity: (!selectedSlot || isSubmitting) ? 0.6 : 1, cursor: (!selectedSlot || isSubmitting) ? 'not-allowed' : 'pointer' }}
                        >
                            {isSubmitting ? 'Kaydediliyor...' : '✅ Randevuyu Tamamla'}
                        </button>
                    </div>
                </div>

                <div className="calendar-panel-right">
                    <div className="date-navigation-container">
                        <button onClick={handlePrevWeek} disabled={weekStartIndex === 0} className="nav-btn nav-btn-left">{'<'}</button>
                        <div className="date-list">
                            {visibleWeekDays.map((date, index) => {
                                const isActive = date.toDateString() === selectedDate.toDateString();
                                return (
                                    <div key={index} className={`date-card ${isActive ? 'active' : ''}`} onClick={() => handleDayCardClick(date)}>
                                        <span className="date-number">{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' })}</span>
                                        <span className="day-name">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={handleNextWeek} disabled={weekStartIndex >= MAX_DAYS - 5} className="nav-btn nav-btn-right">{'>'}</button>
                        <div className="custom-date-selector">
                            <button className="date-select-btn" onClick={() => setCalendarVisible(prev => !prev)}>📅 Tarih Seç</button>
                            {calendarVisible && (
                                <div className="calendar-popup">
                                    <Calendar 
                                        onChange={handleDateChangeFromCalendar} 
                                        value={selectedDate} 
                                        minDate={minDate} 
                                        maxDate={maxDate} 
                                        locale="tr-TR" 
                                        tileDisabled={({ date, view }) => view === 'month' && (date < minDate || date > maxDate)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="time-slots-grid-wrap">
                        <p className="selected-date-label">
                            {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <div className="time-slots-grid">
                            {currentTimeSlots.map(slot => (
                                <button
                                    key={slot.time}
                                    className={`time-slot ${slot.isAvailable ? 'available' : 'unavailable'} ${selectedSlot === slot.time ? 'selected' : ''}`}
                                    onClick={() => setSelectedSlot(slot.time)}
                                    disabled={!slot.isAvailable}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
         </div>
>>>>>>> main
      </div>
    </main>
  );
}