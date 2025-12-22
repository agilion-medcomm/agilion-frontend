import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
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
const formatDateForBackend = (date) => {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}.${month}.${year}`;
};

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
	const { t, i18n } = useTranslation(['appointment']);
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
			const dateStr = formatDateForBackend(selectedDate);
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
			alert(t('appointment:form.error_range'));
		}
	};

	const handleFinalAppointment = async () => {
		if (!selectedSlot) return alert(t('appointment:form.error_select_slot'));
		if (!user) {
			alert(t('appointment:form.error_login_required'));
			return navigate('/login');
		}

		// Modern onay modalı
		const confirmBooking = window.confirm(
			`${t('appointment:form.confirm_title')}\n\n` +
			`${t('appointment:form.confirm_doctor')}: ${doctor.firstName} ${doctor.lastName}\n` +
			`${t('appointment:form.confirm_date')}: ${formatDateForBackend(selectedDate)}\n` +
			`${t('appointment:form.confirm_time')}: ${selectedSlot}\n\n` +
			`${t('appointment:form.confirm_question')}`
		);

		if (!confirmBooking) return;

		setIsSubmitting(true);
		const payload = {
			doctorId: doctor.id,
			doctorName: `${doctor.firstName} ${doctor.lastName}`,
			patientId: user.id,
			patientFirstName: user.firstName,
			patientLastName: user.lastName,
			date: formatDateForBackend(selectedDate),
			time: selectedSlot,
			status: 'APPROVED'
		};

		try {
			await axios.post(`${BaseURL}/appointments`, payload, {
				headers: { Authorization: `Bearer ${token}` }
			});
			alert(`${t('appointment:form.success_message')}\n\n${payload.date} - ${payload.time}`);
			if (onSuccess) onSuccess(); // Başarı callback'i (örn: sayfayı yenilemek için)
			if (onClose) onClose();     // Modalı kapat
		} catch (error) {
			alert("❌ Hata: " + (error.response?.data?.message || error.message));
		} finally {
			setIsSubmitting(false);
		}
	};

	// --- Render Helper ---
	const DoctorAvatar = () => {
		if (doctor.img) {
			const imgSrc = doctor.img.startsWith('http') ? doctor.img : `${API_BASE}${doctor.img}`;
			return <img src={imgSrc} alt="Dr." className="doctor-modal-img" />;
		}
		const initials = `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase();
		return <div className="doctor-modal-avatar-placeholder">{initials}</div>;
	};

	const visibleWeekDays = allDays.slice(weekStartIndex, weekStartIndex + 5);


	return (
		<div className="appointment-component-container">
			<div className="modal-content-grid">
				<div className="doctor-panel-left">
					<DoctorAvatar />
					<div className="doctor-info-text">
						<h2 className="doctor-name">{doctor.firstName} {doctor.lastName}</h2>
						<p className="doctor-specialization">{doctor.specialization || t('appointment:placeholders.general_doctor')}</p>
					</div>
					<div className="randevu-onay-wrap">
						<button
							className="confirm-appointment-btn"
							onClick={handleFinalAppointment}
							disabled={!selectedSlot || isSubmitting}
							style={{ opacity: (!selectedSlot || isSubmitting) ? 0.6 : 1 }}
						>
							{isSubmitting ? t('appointment:labels.processing') : t('appointment:labels.confirm_btn')}
						</button>
					</div>
				</div>

				{/* SAĞ PANEL: Takvim */}
				<div className="calendar-panel-right">
					<div className="date-navigation-container">
						<button onClick={() => setWeekStartIndex(p => Math.max(p - 5, 0))} disabled={weekStartIndex === 0} className="nav-btn">
							<img src="/angle-left.svg" alt="Geri" width="18" height="18" />
						</button>
						<div className="date-list">
							{visibleWeekDays.map((date, i) => (
								<div
									key={i}
									className={`date-card ${date.toDateString() === selectedDate.toDateString() ? 'active' : ''}`}
									onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
								>
									<span className="date-number">{date.getDate()}</span>
									<span className="day-name">{date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' })}</span>
								</div>
							))}
						</div>
						<button onClick={() => setWeekStartIndex(p => Math.min(p + 5, MAX_DAYS - 5))} disabled={weekStartIndex >= MAX_DAYS - 5} className="nav-btn">
							<img src="/angle-right.svg" alt="İleri" width="18" height="18" />
						</button>
					</div>

					<div className="custom-date-selector">
						<button className="date-select-btn" onClick={() => setCalendarVisible(!calendarVisible)}>
							<img src="/calendar.svg" alt="Takvim" width="18" height="18" />
							<span>{t('appointment:labels.select_date')}</span>
						</button>
						{calendarVisible && (
							<div className="calendar-popup">
								<Calendar
									onChange={handleDateChangeFromCalendar}
									value={selectedDate}
									minDate={minDate}
									maxDate={maxDate}
									locale={i18n.language === 'tr' ? 'tr-TR' : 'en-US'}
									prevLabel={<img src="/angle-left.svg" alt="Önceki" width="16" height="16" />}
									nextLabel={<img src="/angle-right.svg" alt="Sonraki" width="16" height="16" />}
									prev2Label={null}
									next2Label={null}
								/>
							</div>
						)}
					</div>

					<div className="time-slots-grid-wrap">
						<p className="selected-date-label">
							{selectedDate.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
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

			{/* DOKTOR BİLGİ ALANI */}
			<div className="doctor-extra-info-section">
				<div className="doctor-info-card">
					<div className="info-card-header">
						<img src="/info-circle.svg" alt="Info" className="info-icon" />
						<h3>{t('appointment:labels.about_doctor')}</h3>
					</div>
					<div className="info-card-body">
						<div className="bio-section">
							<h4>{t('appointment:labels.bio')}</h4>
							<p>
								{doctor.bio || t('appointment:placeholders.default_bio', {
									name: `${doctor.firstName} ${doctor.lastName}`,
									specialization: doctor.specialization || t('appointment:placeholders.expertise_area')
								})}
							</p>
						</div>

						<div className="expertise-grid">
							<div className="expertise-item">
								<h4>{t('appointment:labels.expertise')}</h4>
								<ul>
									{doctor.expertise ? (
										doctor.expertise.split('\n').filter(line => line.trim()).map((item, idx) => (
											<li key={idx}>{item}</li>
										))
									) : (
										t('appointment:placeholders.default_expertise', { returnObjects: true }).map((item, idx) => (
											<li key={idx}>{item}</li>
										))
									)}
								</ul>
							</div>
							<div className="expertise-item">
								<h4>{t('appointment:labels.education')}</h4>
								<ul>
									{doctor.education ? (
										doctor.education.split('\n').filter(line => line.trim()).map((item, idx) => (
											<li key={idx}>{item}</li>
										))
									) : (
										t('appointment:placeholders.default_education', { returnObjects: true }).map((item, idx) => (
											<li key={idx}>{item}</li>
										))
									)}
								</ul>
							</div>
						</div>

						<div className="principles-section">
							<h4>{t('appointment:labels.principles')}</h4>
							<p>
								{doctor.principles || t('appointment:placeholders.default_principles')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}