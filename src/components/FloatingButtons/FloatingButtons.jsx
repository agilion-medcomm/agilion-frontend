import React from "react";
import { Link } from "react-router-dom"; // 1. Adım: Link bileşenini import edin
import "./FloatingButtons.css";
import calendarIcon from "./calendar.svg";
import phoneIcon from "./phone.svg";

export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      {/* Bu buton şimdilik bir yere gitmiyor, bir modal açabilir veya başka bir işlem yapabilir */}
      <button className="floating-btn floating-btn--appointment">
        <img src={calendarIcon} alt="Takvim ikonu" className="icon" />
        <span>Hızlı Randevu</span>
      </button>

      {/* 2. Adım: <button> etiketini <Link> ile değiştirin */}
      <Link to="/contact" className="floating-btn floating-btn--contact">
        <img src={phoneIcon} alt="Telefon ikonu" className="icon" />
        <span>İletişim</span>
      </Link>
    </div>
  );
}