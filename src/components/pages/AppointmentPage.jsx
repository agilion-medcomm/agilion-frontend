import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Appointment from '../Appointment/Appointment';
import './AppointmentPage.css';

export default function AppointmentPage() {
   const { t } = useTranslation(['appointment']);
   const location = useLocation();
   const navigate = useNavigate();
   const doctor = location.state?.doctor;

   if (!doctor) {
      return (
         <div className="appointment-page-wrapper" style={{ alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ color: '#c1272d', marginBottom: '20px' }}>{t('appointment:page.error_no_doctor')}</h2>
               <button
                  onClick={() => navigate('/hekimlerimiz')}
                  style={{ padding: '12px 24px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
               >
                  {t('appointment:page.go_to_doctors')}
               </button>
            </div>
         </div>
      );
   }

   return (
      <main className="appointment-page-wrapper">
         <div className="appointment-page-container">
            {/* Geri Dön Butonu */}
            <div className="back-nav-container" onClick={() => navigate(-1)}>
               <button className="back-link-btn">
                  <img src="/angle-left.svg" alt="Back" />
               </button>
               <span className="back-nav-text">{t('appointment:page.back_button')}</span>
            </div>

            {/* Randevu Bileşeni */}
            <Appointment
               doctor={doctor}
               onSuccess={() => navigate('/')}
            />
         </div>
      </main>
   );
}