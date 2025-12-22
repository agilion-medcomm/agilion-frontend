import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

const DEPARTMENTS = [
  'Acil 7/24',
  'Ağız ve Diş',
  'Beslenme Diyet',
  'Dermatoloji',
  'Genel Cerrahi',
  'Göz Sağlığı',
  'İç Hastalıklar',
  'Kadın & Doğum'
];

export default function CashierDashboard() {
  const navigate = useNavigate();
  const { user, token } = usePersonnelAuth();

  // STATES
  const [searchTckn, setSearchTckn] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Register form states
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    tckn: '',
    password: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Appointment states
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');
  const [appointmentSuccess, setAppointmentSuccess] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [confirmModal, setConfirmModal] = useState({ open: false });

  // Authorization check
  if (!user || user.role !== 'CASHIER') {
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontSize: '18px', color: '#c1272d', fontWeight: 'bold' }}>
        ⛔ Yetkiniz yok. Lütfen Vezne Çalışanı olarak giriş yapınız.
      </div>
    );
  }

  // === SEARCH PATIENT ===
  const handleSearchPatient = async (e) => {
    e.preventDefault();
    
    if (!searchTckn.trim() || searchTckn.length !== 11) {
      setSearchError('Geçerli bir TC Kimlik Numarası giriniz (11 haneli).');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    setFoundPatient(null);
    setShowRegisterForm(false);

    try {
      const response = await axios.get(`${BaseURL}/patients/search`, {
        params: { tckn: searchTckn },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.data) {
        setFoundPatient(response.data.data);
        setSearchError('');
      } else {
        setShowRegisterForm(true);
        setSearchError('');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setShowRegisterForm(true);
        setSearchError('');
      } else {
        setSearchError(error.response?.data?.message || 'Hasta aranırken hata oluştu.');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // === REGISTER NEW PATIENT ===
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => {
      const updated = { ...prev, [name]: value };
      // TC değiştiğinde password'ü otomatik TC'ye ayarla
      if (name === 'tckn') {
        updated.password = value;
      }
      return updated;
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError('');
    setRegisterSuccess('');

    try {
      const response = await axios.post(`${BaseURL}/auth/register`, {
        ...registerForm,
        role: 'PATIENT'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newPatient = {
        id: response.data?.data?.userId || response.data?.data?.id,
        patientId: response.data?.data?.patientId,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        phoneNumber: registerForm.phoneNumber,
        dateOfBirth: registerForm.dateOfBirth,
        tckn: registerForm.tckn
      };

      setFoundPatient(newPatient);
      setRegisterSuccess('✅ Hasta kaydı başarıyla oluşturuldu! Mail onayından sonra aktif olacak.');
      setShowRegisterForm(false);
      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        tckn: '',
        password: ''
      });

      setTimeout(() => setRegisterSuccess(''), 3000);
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // === FETCH DOCTORS BY DEPARTMENT ===
  useEffect(() => {
    if (selectedDepartment && foundPatient) {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get(`${BaseURL}/doctors`, {
            params: { specialization: selectedDepartment },
            headers: { Authorization: `Bearer ${token}` }
          });
          setDoctorsList(response.data?.data || []);
          setSelectedDoctor('');
          setAvailableDates([]);
          setAvailableTimes([]);
        } catch (error) {
          console.error('Doktor listesi hatası:', error);
          setDoctorsList([]);
        }
      };
      fetchDoctors();
    }
  }, [selectedDepartment, foundPatient, token]);

  // === GENERATE AVAILABLE DATES ===
  useEffect(() => {
    if (selectedDoctor && foundPatient) {
      const dates = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Generate 90 days from today (rolling window - includes past month days)
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 30); // Show 30 days before for context

      for (let i = 0; i <= 120; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Include all days (no weekend skip)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;
        
        // Check if within 90-day bookable range
        const daysFromToday = Math.floor((date - today) / (1000 * 60 * 60 * 24));
        const isBookable = daysFromToday >= 1 && daysFromToday <= 90;

        dates.push({
          formatted: formattedDate,
          date: date,
          dayOfWeek: date.getDay(),
          dayName: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][date.getDay()],
          isBookable: isBookable
        });
      }

      setAvailableDates(dates);
      setSelectedDate('');
      setAvailableTimes([]);
      // Set calendar to today
      setCalendarMonth(new Date(today));
    }
  }, [selectedDoctor, foundPatient]);

  // === FETCH AVAILABLE TIMES ===
  useEffect(() => {
    if (selectedDate && selectedDoctor && foundPatient) {
      const fetchAvailableTimes = async () => {
        try {
          // selectedDate is now an object with formatted date
          const dateString = typeof selectedDate === 'object' ? selectedDate.formatted : selectedDate;
          
          const response = await axios.get(`${BaseURL}/appointments`, {
            params: {
              doctorId: selectedDoctor,
              date: dateString
            },
            headers: { Authorization: `Bearer ${token}` }
          });

          const bookedTimes = response.data?.data?.bookedTimes || [];
          
          const allTimes = [];
          for (let hour = 9; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
              const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
              allTimes.push(time);
            }
          }

          const available = allTimes.filter(time => !bookedTimes.includes(time));
          setAvailableTimes(available);
          setSelectedTime('');
        } catch (error) {
          console.error('Saat listesi hatası:', error);
          setAvailableTimes([]);
        }
      };
      fetchAvailableTimes();
    }
  }, [selectedDate, selectedDoctor, foundPatient, token]);

  // === SHOW CONFIRMATION MODAL ===
  const handleShowConfirmation = (e) => {
    e.preventDefault();

    if (!foundPatient || !selectedDoctor || !selectedDate || !selectedTime) {
      setAppointmentError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    // Find doctor name from doctorsList
    const doctor = doctorsList.find(d => d.id === parseInt(selectedDoctor));
    const doctorName = doctor ? `${doctor.user?.firstName || ''} ${doctor.user?.lastName || ''}`.trim() : 'Bilinmiyor';
    const dateString = typeof selectedDate === 'object' ? selectedDate.formatted : selectedDate;

    setConfirmModal({
      open: true,
      doctorName,
      department: selectedDepartment,
      date: dateString,
      time: selectedTime,
      patientName: `${foundPatient.firstName} ${foundPatient.lastName}`
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ open: false });
  };

  // === CREATE APPOINTMENT ===
  const handleCreateAppointment = async () => {
    setConfirmModal({ open: false });
    setAppointmentLoading(true);
    setAppointmentError('');

    try {
      // selectedDate is now an object with formatted date
      const dateString = typeof selectedDate === 'object' ? selectedDate.formatted : selectedDate;
      
      const appointmentData = {
        doctorId: parseInt(selectedDoctor),
        patientId: parseInt(foundPatient.patientId || foundPatient.id),
        date: dateString,
        time: selectedTime,
        status: 'APPROVED'
      };

      await axios.post(`${BaseURL}/appointments`, appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAppointmentSuccess('✅ Randevu başarıyla oluşturuldu!');
      
      // Reset form
      setTimeout(() => {
        setFoundPatient(null);
        setSearchTckn('');
        setSelectedDepartment('');
        setSelectedDoctor('');
        setSelectedDate('');
        setSelectedTime('');
        setDoctorsList([]);
        setAvailableDates([]);
        setAvailableTimes([]);
        setAppointmentSuccess('');
      }, 2000);
    } catch (error) {
      setAppointmentError(error.response?.data?.message || 'Randevu oluşturma sırasında hata oluştu.');
    } finally {
      setAppointmentLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>💳 Vezne Paneli - Randevu Alma</h1>
      <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Hastalar için randevu oluştur veya yeni hastalar kaydet</p>

      {/* ===== SEARCH SECTION ===== */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '18px' }}>🔍 Adım 1: Hastayı Ara</h2>
        
        <form onSubmit={handleSearchPatient} style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="TC Kimlik Numarası (11 haneli)..."
            value={searchTckn}
            onChange={(e) => setSearchTckn(e.target.value)}
            maxLength={11}
            style={{
              flex: 1,
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
          <button
            type="submit"
            disabled={searchLoading}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: searchLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              opacity: searchLoading ? 0.6 : 1
            }}
          >
            {searchLoading ? '🔄 Aranıyor...' : '🔍 Ara'}
          </button>
        </form>

        {searchError && (
          <div style={{ color: '#c1272d', padding: '12px', background: '#ffebee', borderRadius: '6px', marginBottom: '15px' }}>
            ❌ {searchError}
          </div>
        )}

        {foundPatient && (
          <div style={{ color: '#2e7d32', padding: '12px', background: '#e8f5e9', borderRadius: '6px' }}>
            ✅ Hasta bulundu: <strong>{foundPatient.firstName} {foundPatient.lastName}</strong> (TC: {foundPatient.tckn})
          </div>
        )}
      </div>

      {/* ===== REGISTER NEW PATIENT SECTION ===== */}
      {showRegisterForm && !foundPatient && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '18px' }}>📝 Adım 1b: Yeni Hasta Kaydı</h2>
          
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="text"
                name="firstName"
                placeholder="Adı *"
                value={registerForm.firstName}
                onChange={handleRegisterChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Soyadı *"
                value={registerForm.lastName}
                onChange={handleRegisterChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="text"
                name="tckn"
                placeholder="TC Numarası *"
                value={registerForm.tckn}
                onChange={handleRegisterChange}
                maxLength={11}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
              <input
                type="email"
                name="email"
                placeholder="E-posta *"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Telefon *"
                value={registerForm.phoneNumber}
                onChange={handleRegisterChange}
                required
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
              <input
                type="date"
                name="dateOfBirth"
                placeholder="Doğum Tarihi"
                value={registerForm.dateOfBirth}
                onChange={handleRegisterChange}
                style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '15px' }}>
              <div style={{ 
                padding: '10px', 
                background: '#f5f5f5', 
                border: '1px solid #ddd', 
                borderRadius: '6px',
                fontSize: '14px',
                color: '#666'
              }}>
                🔐 <strong>Şifre:</strong> TC Numarası ile otomatik ayarlanacak ({registerForm.tckn || 'TC giriniz'})
              </div>
            </div>

            {registerError && (
              <div style={{ color: '#c1272d', padding: '12px', background: '#ffebee', borderRadius: '6px', marginBottom: '15px' }}>
                ❌ {registerError}
              </div>
            )}

            {registerSuccess && (
              <div style={{ color: '#2e7d32', padding: '12px', background: '#e8f5e9', borderRadius: '6px', marginBottom: '15px' }}>
                {registerSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={registerLoading}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: registerLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: registerLoading ? 0.6 : 1,
                width: '100%'
              }}
            >
              {registerLoading ? '⏳ Kaydediliyor...' : '✅ Hastayı Kaydet'}
            </button>
          </form>
        </div>
      )}

      {/* ===== APPOINTMENT BOOKING SECTION ===== */}
      {foundPatient && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333', fontSize: '18px' }}>📅 Adım 2: Randevu Oluştur</h2>
          
          <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '6px' }}>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#1976d2' }}>
              👤 Hasta: {foundPatient.firstName} {foundPatient.lastName}
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#555' }}>
              📧 {foundPatient.email} | 📱 {foundPatient.phoneNumber}
            </p>
          </div>

          <form onSubmit={handleShowConfirmation}>
            {/* Department Selection */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Bölüm Seçiniz *</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                <option value="">-- Bölüm Seçiniz --</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            {selectedDepartment && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Doktor Seçiniz *</label>
                {doctorsList.length === 0 ? (
                  <p style={{ color: '#f57c00', padding: '10px', background: '#fff3e0', borderRadius: '6px', margin: 0 }}>
                    ⚠️ Seçilen bölüme ait doktor bulunamadı.
                  </p>
                ) : (
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">-- Doktor Seçiniz --</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.firstName} {doc.lastName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Date Selection - Calendar View */}
            {selectedDoctor && availableDates.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px', fontSize: '13px' }}>📅 Tarih Seçiniz *</label>
                
                {/* Calendar Grid */}
                <div style={{
                  background: '#f9f9f9',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '12px',
                }}>
                  {/* Group by month and show only current month from calendarMonth state */}
                  {Object.entries(availableDates.reduce((groups, dateObj) => {
                    const key = `${dateObj.date.getFullYear()}-${dateObj.date.getMonth()}`;
                    if (!groups[key]) {
                      groups[key] = [];
                    }
                    groups[key].push(dateObj);
                    return groups;
                  }, {})).map(([monthKey, monthDates], idx, arr) => {
                    const monthDate = monthDates[0].date;
                    const currentMonthKey = `${calendarMonth.getFullYear()}-${calendarMonth.getMonth()}`;
                    const isCurrentMonth = monthKey === currentMonthKey;
                    
                    // Calculate bounds for month navigation
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const minMonth = new Date(today);
                    minMonth.setDate(minMonth.getDate() - 30);
                    const maxMonth = new Date(today);
                    maxMonth.setDate(maxMonth.getDate() + 90);
                    
                    // Create dates for the first day of each month for comparison
                    const currentMonthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
                    const minMonthStart = new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);
                    const maxMonthStart = new Date(maxMonth.getFullYear(), maxMonth.getMonth(), 1);
                    
                    const canGoPrev = currentMonthStart > minMonthStart;
                    const canGoNext = currentMonthStart < maxMonthStart;
                    
                    return isCurrentMonth ? (
                      <div key={monthKey}>
                        {/* Month Navigation */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <button
                            type="button"
                            onClick={() => {
                              const prevMonth = new Date(calendarMonth);
                              prevMonth.setMonth(prevMonth.getMonth() - 1);
                              setCalendarMonth(prevMonth);
                            }}
                            disabled={!canGoPrev}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '16px',
                              cursor: canGoPrev ? 'pointer' : 'not-allowed',
                              padding: '2px 6px',
                              color: canGoPrev ? '#667eea' : '#ccc',
                              fontWeight: 'bold',
                              opacity: canGoPrev ? 1 : 0.5
                            }}
                          >
                            ← Önceki
                          </button>
                          
                          <h4 style={{ margin: 0, color: '#667eea', fontSize: '13px', fontWeight: '600' }}>
                            {monthDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                          </h4>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const nextMonth = new Date(calendarMonth);
                              nextMonth.setMonth(nextMonth.getMonth() + 1);
                              setCalendarMonth(nextMonth);
                            }}
                            disabled={!canGoNext}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '16px',
                              cursor: canGoNext ? 'pointer' : 'not-allowed',
                              padding: '2px 6px',
                              color: canGoNext ? '#667eea' : '#ccc',
                              fontWeight: 'bold',
                              opacity: canGoNext ? 1 : 0.5
                            }}
                          >
                            Sonraki →
                          </button>
                        </div>
                        
                        {/* Days of week header - Starting from Monday */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gap: '6px',
                          marginBottom: '6px'
                        }}>
                          {['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Cm', 'Pz'].map(day => (
                            <div key={day} style={{
                              textAlign: 'center',
                              fontWeight: 'bold',
                              fontSize: '10px',
                              color: '#999',
                              padding: '2px'
                            }}>
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar days - Get first day of month and fill grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(7, 1fr)',
                          gap: '6px'
                        }}>
                          {/* Empty cells for days before month starts */}
                          {Array.from({ length: ((monthDates[0].date.getDay() - 1 + 7) % 7) }).map((_, i) => (
                            <div key={`empty-${i}`}></div>
                          ))}
                          
                          {monthDates.map(dateObj => {
                            const isSelected = selectedDate?.formatted === dateObj.formatted;
                            const isWeekend = dateObj.dayOfWeek === 0 || dateObj.dayOfWeek === 6;
                            const isDisabled = !dateObj.isBookable;
                            
                            return (
                              <button
                                key={dateObj.formatted}
                                type="button"
                                onClick={() => {
                                  if (!isDisabled) setSelectedDate(dateObj);
                                }}
                                disabled={isDisabled}
                                style={{
                                  padding: '10px 4px',
                                  border: isSelected ? '2px solid #667eea' : '1px solid #ddd',
                                  background: isSelected ? '#e8eaf6' : isDisabled ? '#f5f5f5' : isWeekend ? '#fff9e6' : 'white',
                                  borderRadius: '4px',
                                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                                  fontWeight: isSelected ? 'bold' : 'normal',
                                  color: isSelected ? '#667eea' : isDisabled ? '#ccc' : isWeekend ? '#f57c00' : '#333',
                                  fontSize: '12px',
                                  textAlign: 'center',
                                  transition: 'all 0.2s',
                                  boxShadow: isSelected ? '0 2px 6px rgba(102, 126, 234, 0.2)' : 'none',
                                  aspectRatio: '1',
                                  opacity: isDisabled ? 0.4 : 1
                                }}
                                title={isDisabled ? '90 günün dışında' : dateObj.dayName}
                              >
                                <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{dateObj.date.getDate()}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Time Selection */}
            {selectedDate && availableTimes.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Saat Seçiniz *</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '8px'
                }}>
                  {availableTimes.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '8px 12px',
                        border: selectedTime === time ? '2px solid #667eea' : '1px solid #ddd',
                        background: selectedTime === time ? '#f3f4ff' : 'white',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: selectedTime === time ? 'bold' : 'normal',
                        color: selectedTime === time ? '#667eea' : '#333',
                        fontSize: '13px'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {appointmentError && (
              <div style={{ color: '#c1272d', padding: '12px', background: '#ffebee', borderRadius: '6px', marginBottom: '15px' }}>
                ❌ {appointmentError}
              </div>
            )}

            {appointmentSuccess && (
              <div style={{ color: '#2e7d32', padding: '12px', background: '#e8f5e9', borderRadius: '6px', marginBottom: '15px' }}>
                {appointmentSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={appointmentLoading || !selectedTime}
              style={{
                padding: '12px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: (!selectedTime || appointmentLoading) ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: (!selectedTime || appointmentLoading) ? 0.6 : 1,
                width: '100%',
                fontSize: '15px'
              }}
            >
              {appointmentLoading ? '⏳ Randevu Oluşturuluyor...' : '✅ Randevu Oluştur'}
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#eef2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '32px' }}>📅</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                Randevu Onayı
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                Aşağıdaki randevuyu onaylıyor musunuz?
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>👤 Hasta:</span>
                <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>{confirmModal.patientName}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>🏥 Bölüm:</span>
                <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>{confirmModal.department}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>👨‍⚕️ Doktor:</span>
                <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>{confirmModal.doctorName}</span>
              </div>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>📆 Tarih:</span>
                <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>{confirmModal.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>🕐 Saat:</span>
                <span style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px' }}>{confirmModal.time}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={closeConfirmModal}
                style={{
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Vazgeç
              </button>
              <button
                onClick={handleCreateAppointment}
                style={{
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#667eea',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ✅ Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
