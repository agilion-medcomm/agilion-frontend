import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorAvailabilityModal.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

const DAYS = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' }
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '17:30';

const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TIME_OPTIONS = [];
for (let h = 0; h <= 24; h++) {
    const hour = h.toString().padStart(2, '0');
    TIME_OPTIONS.push(`${hour}:00`);
    if (h !== 24) {
        TIME_OPTIONS.push(`${hour}:30`);
    }
}

// Restrict hours to 09:00 - 17:00 range as requested
const HOURS = Array.from({ length: 9 }, (_, i) => (i + 9).toString().padStart(2, '0'));
// If we need to support 17:00 as end time (exclusive), 17 is in list. 
// If later times are needed, this list will need to be expanded.
const MINUTES = ['00', '30'];

function TimePicker({ value, onChange, disabled }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const [hour, minute] = (value || '09:00').split(':');

    const handleHourSelect = (newHour) => {
        let newMinute = minute;
        // Logic constraint: 24:00 only, not 24:30
        if (newHour === '24') newMinute = '00';
        onChange(`${newHour}:${newMinute}`);
    };

    const handleMinuteSelect = (newMinute) => {
        // Logic constraint: cannot set 30 if hour is 24
        if (hour === '24') return;
        onChange(`${hour}:${newMinute}`);
    };

    return (
        <div className="time-picker-container" ref={containerRef}>
            <button
                className={`time-picker-button ${isOpen ? 'active' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
            >
                {value}
                <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="time-picker-popover fade-in">
                    <div className="time-column">
                        <div className="time-column-header">Saat</div>
                        <div className="time-list custom-scrollbar">
                            {HOURS.map(h => (
                                <div
                                    key={h}
                                    className={`time-item ${hour === h ? 'selected' : ''}`}
                                    onClick={() => handleHourSelect(h)}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="time-column-divider"></div>
                    <div className="time-column">
                        <div className="time-column-header">Dakika</div>
                        <div className="time-list custom-scrollbar">
                            {MINUTES.map(m => (
                                <div
                                    key={m}
                                    className={`time-item ${minute === m ? 'selected' : ''} ${hour === '24' ? 'disabled' : ''}`}
                                    onClick={() => handleMinuteSelect(m)}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DoctorAvailabilityModal({ onClose, doctor, refreshData }) {
    const [protocol, setProtocol] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (doctor?.availabilityProtocol && Object.keys(doctor.availabilityProtocol).length > 0) {
            // If doctor has a saved protocol, use it
            setProtocol(doctor.availabilityProtocol);
        } else {
            // If no protocol exists, default to all days available (9:00-17:30)
            // This matches the database initial state where doctors are free for the whole week
            const defaultProtocol = {};
            DAYS.forEach(day => {
                defaultProtocol[day.key] = {
                    start: DEFAULT_START,
                    end: DEFAULT_END,
                    isAvailable: true
                };
            });
            setProtocol(defaultProtocol);
        }
    }, [doctor]);

    const handleDayToggle = (dayKey) => {
        setProtocol(prev => {
            const current = prev[dayKey];

            if (current && current.isAvailable) {
                // Turn off
                return {
                    ...prev,
                    [dayKey]: {
                        ...current,
                        isAvailable: false
                    }
                };
            } else {
                // Turn on
                return {
                    ...prev,
                    [dayKey]: {
                        start: current?.start || DEFAULT_START,
                        end: current?.end || DEFAULT_END,
                        isAvailable: true
                    }
                };
            }
        });
    };

    const handleTimeChange = (dayKey, field, newValue) => {
        // field: 'start' | 'end'
        setProtocol(prev => {
            const currentDay = prev[dayKey];
            let newStart = field === 'start' ? newValue : (currentDay.start || DEFAULT_START);
            let newEnd = field === 'end' ? newValue : (currentDay.end || DEFAULT_END);

            // Logic: Prevent Start > End
            // If Start is changed and becomes > End, push End to Start
            // If End is changed and becomes < Start, push Start to End
            if (newStart > newEnd) {
                if (field === 'start') {
                    newEnd = newStart;
                } else {
                    newStart = newEnd;
                }
            }

            return {
                ...prev,
                [dayKey]: {
                    ...currentDay,
                    start: newStart,
                    end: newEnd
                }
            };
        });
    };

    const handleSave = async () => {
        // Validate Protocol
        for (const day of DAYS) {
            const config = protocol[day.key];
            if (config?.isAvailable) {
                const start = config.start || DEFAULT_START;
                const end = config.end || DEFAULT_END;
                if (start >= end) {
                    alert(`${day.label} için Başlangıç saati Bitiş saatinden önce olmalıdır.`);
                    return;
                }
            }
        }

        setSaving(true);
        const token = localStorage.getItem('personnelToken');
        try {
            await axios.put(`${BaseURL}/doctors/${doctor.id}/availability`, {
                availabilityProtocol: protocol
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            refreshData();
            onClose();
        } catch (error) {
            console.error("Failed to save protocol", error);
            alert(error.response?.data?.message || "Çalışma saatleri kaydedilirken bir hata oluştu.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="availability-modal-overlay" onClick={onClose}>
            <div className="availability-modal" onClick={e => e.stopPropagation()}>
                <div className="availability-header">
                    <h2>Haftalık Çalışma Planı - {doctor.firstName} {doctor.lastName}</h2>
                    <button className="btn-icon" onClick={onClose} style={{ pointerEvents: 'auto' }}>
                        <XIcon />
                    </button>
                </div>

                <div className="availability-content">
                    <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '0.9rem' }}>
                        Doktorun haftalık uygunluk durumunu belirleyin. Kapalı olan günlerde randevu oluşturulamaz.
                    </p>

                    <div className="availability-days">
                        {DAYS.map(day => {
                            const config = protocol[day.key];
                            const isAvailable = config?.isAvailable || false;
                            const start = config?.start || DEFAULT_START;
                            const end = config?.end || DEFAULT_END;

                            return (
                                <div key={day.key} className={`day-row ${isAvailable ? 'active' : ''}`}>
                                    <div className="day-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isAvailable}
                                            onChange={() => handleDayToggle(day.key)}
                                        />
                                    </div>
                                    <div className="day-name">{day.label}</div>

                                    {isAvailable ? (
                                        <div className="time-inputs">
                                            <TimePicker
                                                value={start}
                                                onChange={(val) => handleTimeChange(day.key, 'start', val)}
                                            />
                                            <span className="range-separator">-</span>
                                            <TimePicker
                                                value={end}
                                                onChange={(val) => handleTimeChange(day.key, 'end', val)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="closed-badge">Kapalı</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="availability-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={saving}>
                        İptal
                    </button>
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
}
