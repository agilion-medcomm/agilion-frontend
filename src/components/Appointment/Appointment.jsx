import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Appointment.css';

// API Ayarları
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
const API_PREFIX = '/api/v1';
const BaseURL = `${API_BASE}${API_PREFIX}`;

// Slot Ayarları
const SLOT_START = 9;
const SLOT_END = 17;
const MAX_DAYS = 90;

// --- Yardımcı Fonksiyonlar ---
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

const generateTimeSlots = (date, bookedTimes = []) => {
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
			const isBooked = bookedTimes.includes(timeStr);

			slots.push({
				time: timeStr,
				isAvailable: !isPast && !isBooked,
			});
		}
	}
	// 17:30 slotunu çıkar (tercihe bağlı)
	return slots.filter(slot => slot.time !== '17:30');
};

export default function Appointment({ doctor, onClose, onSuccess }) {
	const { user, token } = useAuth();
	const navigate = useNavigate();

	// --- State Yönetimi ---
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
	const [bookedTimes, setBookedTimes] = useState([]);
	const [weekStartIndex, setWeekStartIndex] = useState(0);
	const [calendarVisible, setCalendarVisible] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// --- Backend'den Dolu Saatleri Çekme ---
	useEffect(() => {
		if (!doctor) return;
		const fetchBookedSlots = async () => {
			const dateStr = selectedDate.toLocaleDateString('tr-TR');
			try {
				const response = await axios.get(`${BaseURL}/appointments`, {
					params: {
						doctorId: doctor.id,
						date: dateStr
					}
				});
				// Backend yapısına göre bookedTimes'ı al
				const data = response.data?.data;
				const slots = Array.isArray(data) ? data.map(a => a.time) : (data?.bookedTimes || []);
				setBookedTimes(slots);
			} catch (error) {
				console.error("Dolu slotlar çekilemedi:", error);
				setBookedTimes([]);
			}
		};
		fetchBookedSlots();
	}, [selectedDate, doctor]);

	const currentTimeSlots = useMemo(() => {
		return generateTimeSlots(selectedDate, bookedTimes);
	}, [selectedDate, bookedTimes]);

	// --- Olay İşleyiciler ---
	const handleDateChangeFromCalendar = (date) => {
		if (date >= minDate && date <= maxDate) {
			setSelectedDate(date);
			setSelectedSlot(null);
			setCalendarVisible(false);

			// Seçilen tarihin olduğu haftaya git
			const newIndex = allDays.findIndex(d => d.toDateString() === date.toDateString());
			if (newIndex !== -1) {
				setWeekStartIndex(Math.max(0, Math.min(newIndex - 2, MAX_DAYS - 5)));
			}
		} else {
			alert("Sadece bugünden itibaren 90 gün içinde randevu alabilirsiniz.");
		}
	};

	const handleFinalAppointment = async () => {
		if (!selectedSlot) return alert("Lütfen bir randevu saati seçiniz.");
		if (!user) {
			alert("Lütfen önce giriş yapınız.");
			return navigate('/login');
		}

		setIsSubmitting(true);
		const payload = {
			doctorId: doctor.id,
			doctorName: `${doctor.firstName} ${doctor.lastName}`,
			patientId: user.id,
			patientFirstName: user.firstName,
			patientLastName: user.lastName,
			date: selectedDate.toLocaleDateString('tr-TR'),
			time: selectedSlot,
			status: 'APPROVED'
		};

		try {
			await axios.post(`${BaseURL}/appointments`, payload, {
				headers: { Authorization: `Bearer ${token}` }
			});
			alert(`Randevunuz başarıyla oluşturuldu!\n${payload.date} - ${payload.time}`);
			if (onSuccess) onSuccess(); // Başarı callback'i (örn: sayfayı yenilemek için)
			if (onClose) onClose();     // Modalı kapat
		} catch (error) {
			alert("Hata: " + (error.response?.data?.message || error.message));
		} finally {
			setIsSubmitting(false);
		}
	};

	// --- Render Helper ---
	const DoctorAvatar = () => {
		if (doctor.img) return <img src={doctor.img} alt="Dr." className="doctor-modal-img" />;
		const initials = `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase();
		return <div className="doctor-modal-avatar-placeholder">{initials}</div>;
	};

	const visibleWeekDays = allDays.slice(weekStartIndex, weekStartIndex + 5);


	return (
		<div className="appointment-component-container">
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
							style={{ opacity: (!selectedSlot || isSubmitting) ? 0.6 : 1 }}
						>
							{isSubmitting ? 'İşleniyor...' : '✅ Randevuyu Onayla'}
						</button>
					</div>
				</div>

				{/* SAĞ PANEL: Takvim */}
				<div className="calendar-panel-right">
					<div className="date-navigation-container">
						<button onClick={() => setWeekStartIndex(p => Math.max(p - 5, 0))} disabled={weekStartIndex === 0} className="nav-btn">{'<'}</button>
						<div className="date-list">
							{visibleWeekDays.map((date, i) => (
								<div
									key={i}
									className={`date-card ${date.toDateString() === selectedDate.toDateString() ? 'active' : ''}`}
									onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
								>
									<span className="date-number">{date.getDate()}</span>
									<span className="day-name">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
								</div>
							))}
						</div>
						<button onClick={() => setWeekStartIndex(p => Math.min(p + 5, MAX_DAYS - 5))} disabled={weekStartIndex >= MAX_DAYS - 5} className="nav-btn">{'>'}</button>

						<div className="custom-date-selector">
							<button className="date-select-btn" onClick={() => setCalendarVisible(!calendarVisible)}>📅</button>
							{calendarVisible && (
								<div className="calendar-popup">
									<Calendar onChange={handleDateChangeFromCalendar} value={selectedDate} minDate={minDate} maxDate={maxDate} locale="tr-TR" />
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
	);
}