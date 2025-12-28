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

            <button onClick={() => navigate(-1)} className="back-link-btn">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
               {t('appointment:page.back_button')}
            </button>

            <Appointment
               doctor={doctor}
               onSuccess={() => navigate('/')}
            />
         </div>
      </main>
   );
}
