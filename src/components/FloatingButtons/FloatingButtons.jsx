
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from '../../context/AuthContext';
import "./FloatingButtons.css";

export default function FloatingButtons() {
  const { t } = useTranslation(['common']);
  const { user: patientUser } = useAuth();
  const navigate = useNavigate();

  const handleHizliRandevuClick = () => {

    if (!patientUser) {
      alert(t('common:please_login_to_book'));
      navigate('/login');
      return;
    }

    navigate('/doktor-sec');
  };

  return (
    <div className="floating-buttons">

      <button
        className="floating-btn floating-btn--appointment"
        onClick={handleHizliRandevuClick}
      >
        <img src="/calendar.svg" alt="" className="icon" />
        <span>{t('common:book_appointment_short')}</span>
      </button>

      <Link to="/contact" className="floating-btn floating-btn--contact">
        <img src="/call.svg" alt="" className="icon" />
        <span>{t('common:contact')}</span>
      </Link>
    </div>
  );
}
