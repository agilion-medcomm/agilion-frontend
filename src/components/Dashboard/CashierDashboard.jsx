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
            params: { department: selectedDepartment },
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

      for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}.${month}.${year}`;

        dates.push(formattedDate);
      }

      setAvailableDates(dates);
      setSelectedDate('');
      setAvailableTimes([]);
    }
  }, [selectedDoctor, foundPatient]);

  // === FETCH AVAILABLE TIMES ===
  useEffect(() => {
    if (selectedDate && selectedDoctor && foundPatient) {
      const fetchAvailableTimes = async () => {
        try {
          const response = await axios.get(`${BaseURL}/appointments`, {
            params: {
              doctorId: selectedDoctor,
              date: selectedDate
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

  // === CREATE APPOINTMENT ===
  const handleCreateAppointment = async (e) => {
    e.preventDefault();

    if (!foundPatient || !selectedDoctor || !selectedDate || !selectedTime) {
      setAppointmentError('Lütfen tüm alanları doldurunuz.');
      return;
    }

    setAppointmentLoading(true);
    setAppointmentError('');

    try {
      const appointmentData = {
        doctorId: parseInt(selectedDoctor),
        patientId: parseInt(foundPatient.patientId || foundPatient.id),
        date: selectedDate,
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

          <form onSubmit={handleCreateAppointment}>
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

            {/* Date Selection */}
            {selectedDoctor && availableDates.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>Tarih Seçiniz *</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
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
                  <option value="">-- Tarih Seçiniz --</option>
                  {availableDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
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
    </div>
  );
}
