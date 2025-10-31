import React from "react";
import "./FloatingButtons.css";
import calendarIcon from "./calendar.svg";
import phoneIcon from "./phone.svg";

export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <button className="floating-btn floating-btn--appointment">
        <img src={calendarIcon} alt="Takvim ikonu" className="icon" />
        <span>Hızlı Randevu</span>
      </button>

      <button className="floating-btn floating-btn--contact">
        <img src={phoneIcon} alt="Telefon ikonu" className="icon" />
        <span>İletişim</span>
      </button>
    </div>
  );
}
