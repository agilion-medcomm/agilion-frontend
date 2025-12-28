
import React, { useState, useMemo, useCallback } from 'react';
import Calendar from 'react-calendar';
import './Appointment.css';

const SLOT_START = 9;
const SLOT_END = 17;
const MAX_DAYS = 90;

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
            const isBooked = bookedSlots.includes(timeStr);

            slots.push({
                time: timeStr,
                isAvailable: !isPast && !isBooked,
            });
        }
    }
    return slots.filter(slot => slot.time !== '17:30');
};

export default function AppointmentV2Modal({ doctor, onClose }) {

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

    const currentTimeSlots = useMemo(() => {
        return generateTimeSlots(selectedDate);
    }, [selectedDate]);

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

    const handleFinalAppointment = () => {
        if (!selectedSlot) {
            alert("Lütfen bir randevu saati seçiniz.");
            return;
        }

        alert(`Randevu Onaylandı: ${doctor.firstName} ${doctor.lastName} için ${selectedDate.toLocaleDateString()} @ ${selectedSlot}`);
        onClose();
    };

    const DoctorAvatar = () => {
        if (doctor.img) {
            return <img src={doctor.img} alt={`Dr. ${doctor.lastName}`} className="doctor-modal-img" />;
        }
        const initials = `${doctor.firstName?.[0] || ''}${doctor.lastName?.[0] || ''}`.toUpperCase();
        return (
            <div className="doctor-modal-avatar-placeholder">
                {initials}
            </div>
        );
    };

    const visibleWeekDays = allDays.slice(weekStartIndex, weekStartIndex + 5);

    return (
        <div className="appointment-modal-overlay">
            <div className="appointment-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                <div className="modal-content-grid">

                    <div className="doctor-panel-left">
                        <h2 className="doctor-name">{doctor.firstName} {doctor.lastName}</h2>
                        <p className="doctor-specialization">{doctor.specialization || 'Genel Hekim'}</p>
                        <DoctorAvatar />

                        <div className="randevu-onay-wrap">
                            <button
                                className="confirm-appointment-btn"
                                onClick={handleFinalAppointment}
                                disabled={!selectedSlot}
                            >
                                ✅ Randevuyu Onaylayın
                            </button>
                        </div>
                    </div>

                    <div className="calendar-panel-right">

                        <div className="date-navigation-container">
                            <button
                                onClick={handlePrevWeek}
                                disabled={weekStartIndex === 0}
                                className="nav-btn nav-btn-left"
                            >{'<'}</button>

                            <div className="date-list">
                                {visibleWeekDays.map((date, index) => {
                                    const isActive = date.toDateString() === selectedDate.toDateString();
                                    return (
                                        <div
                                            key={index}
                                            className={`date-card ${isActive ? 'active' : ''}`}
                                            onClick={() => handleDayCardClick(date)}
                                        >
                                            <span className="date-number">
                                                {date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'numeric' })}
                                            </span>
                                            <span className="day-name">
                                                {date.toLocaleDateString('tr-TR', { weekday: 'short' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleNextWeek}
                                disabled={weekStartIndex >= MAX_DAYS - 5}
                                className="nav-btn nav-btn-right"
                            >{'>'}</button>

                            <div className="custom-date-selector">
                                <button className="date-select-btn" onClick={() => setCalendarVisible(prev => !prev)}>
                                    📅 Tarihi Seç
                                </button>

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
                                {selectedDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })} tarihindeki boş slotlar:
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
        </div>
    );
}
