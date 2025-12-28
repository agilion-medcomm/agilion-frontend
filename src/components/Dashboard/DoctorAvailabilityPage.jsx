import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import DoctorAvailabilityModal from './DoctorAvailabilityModal';
import './DoctorAvailabilityPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

const SPECIALTY_LABELS = {
    EMERGENCY: 'Acil 7/24',
    ORAL_AND_DENTAL: 'Ağız ve Diş',
    NUTRITION_DIET: 'Beslenme Diyet',
    DERMATOLOGY: 'Dermatoloji',
    GENERAL_SURGERY: 'Genel Cerrahi',
    EYE_HEALTH: 'Göz Sağlığı',
    INTERNAL_MEDICINE: 'İç Hastalıklar',
    GYNECOLOGY_OBSTETRICS: 'Kadın & Doğum',
};

const ClockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

export default function DoctorAvailabilityPage() {
    const { user, token, logoutPersonnel } = usePersonnelAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (token) {
            fetchDoctors();
        }
    }, [token]);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            // Fetch only doctors
            const res = await axios.get(`${BaseURL}/personnel?role=DOCTOR`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Fetched doctors:", res.data);
            const allPersonnel = res.data?.data || [];
            const docList = allPersonnel.filter(p => p.role === 'DOCTOR');
            setDoctors(docList);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            if (error.response && error.response.status === 401) {
                logoutPersonnel(); // Auto logout on 401
            }
        } finally {
            setLoading(false);
        }
    };

    const openModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="page-loading">
                <div className="spinner"></div>
                <p>Doktorlar yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="doctor-availability-page">
            <div className="page-header">
                <h1 className="page-title">Çalışma Saatleri</h1>
                <p className="page-subtitle">Doktorların haftalık çalışma programını yönetin.</p>
            </div>

            <div className="doctor-cards-grid">
                {doctors.length === 0 ? (
                    <p>Kayıtlı doktor bulunamadı.</p>
                ) : (
                    doctors.map(doctor => (
                        <div key={doctor.id} className="doctor-card fade-in">
                            <div className="doctor-avatar-container">
                                <div className="doctor-avatar-large">
                                    {doctor.photoUrl ? (
                                        <img src={doctor.photoUrl.startsWith('http') ? doctor.photoUrl : `${API_BASE}${doctor.photoUrl}`} alt={doctor.firstName} />
                                    ) : (
                                        <span>{doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="doctor-info">
                                <h3>{doctor.firstName} {doctor.lastName}</h3>
                                <span className="doctor-role-badge">
                                    {SPECIALTY_LABELS[doctor.specialization] || doctor.specialization || 'Genel Hekim'}
                                </span>
                            </div>
                            <button className="btn-manage-schedule" onClick={() => openModal(doctor)}>
                                <ClockIcon />
                                <span>Programı Düzenle</span>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {showModal && selectedDoctor && (
                <DoctorAvailabilityModal
                    doctor={selectedDoctor}
                    onClose={() => setShowModal(false)}
                    refreshData={fetchDoctors}
                />
            )}
        </div>
    );
}
