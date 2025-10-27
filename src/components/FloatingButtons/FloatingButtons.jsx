import React from "react";
import "./FloatingButtons.css";

export default function FloatingButtons() {
  return (
    <div className="floating-buttons">
      <button className="floating-btn floating-btn--appointment">
        <CalendarIcon />
        <span>Hızlı Randevu</span>
      </button>
      <button className="floating-btn floating-btn--contact">
        <PhoneIcon />
        <span>İletişim</span>
      </button>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="6" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3l3 3-2 2a14 14 0 007 7l2-2 3 3-2 3c-6 1-14-7-13-13L6 3z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}