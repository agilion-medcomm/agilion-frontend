// src/components/FloatingButtons/FloatingButtons.jsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import "./FloatingButtons.css";

export default function FloatingButtons() {
  const { user: patientUser } = useAuth();
  const navigate = useNavigate();

  const handleHizliRandevuClick = () => {
    // 1. Kural: Kullanıcı login değilse, login sayfasına yönlendir.
    if (!patientUser) {
      alert("Randevu alabilmek için önce giriş yapınız.");
      navigate('/login');
      return;
    }

    // 2. Kural: Kullanıcı login ise, DOKTOR SEÇME sayfasına yönlendir.
    // (Modal açmak yerine yeni sisteme bağlıyoruz)
    navigate('/doktor-sec');
  };

  return (
    <div className="floating-buttons">

      {/* Hızlı Randevu Butonu */}
      <button
        className="floating-btn floating-btn--appointment"
        onClick={handleHizliRandevuClick}
      >
        <img src="/calendar.svg" alt="" className="icon" />
        <span>Hızlı Randevu</span>
      </button>

      {/* İletişim Butonu */}
      <Link to="/contact" className="floating-btn floating-btn--contact">
        <img src="/call.svg" alt="" className="icon" />
        <span>İletişim</span>
      </Link>
    </div>
  );
}