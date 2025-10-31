// src/components/Menu/Menu.jsx (SCROLL SORUNU ÇÖZÜLMÜŞ)

import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "./Menu.css";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuOpen) return;

      const hamburgerBtn = document.querySelector('.hamburger');
      if (hamburgerBtn && hamburgerBtn.contains(e.target)) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  function toggleMenu() {
    setMenuOpen(prev => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    closeMenu();
    logout();
  }

  // 🔥 YENİ: Link tıklamalarını engelleyen handler
  const handleNavClick = (e) => {
    e.preventDefault();
    // Burada routing yapılabilir
  };

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar__row">
          <div className="topbar__left">
            <span className="topbar__item">
              <MailIcon />
              <a href="mailto:info@medcommercial.com.tr">info@medcommercial.com.tr</a>
            </span>
            <span className="topbar__item">
              <PhoneIcon /> Çağrı Merkezi: <strong>(212) 000 00 00</strong>
            </span>
          </div>
          <div className="topbar__right">
            {/* 🔥 Sosyal medya linklerine preventDefault eklendi */}
            <a className="social" href="#" aria-label="Facebook" onClick={handleNavClick}>
              <FbIcon />
            </a>
            <a className="social" href="#" aria-label="Instagram" onClick={handleNavClick}>
              <IgIcon />
            </a>
            <span className="lang">TR</span>

            {user ? (
              <div className="user-menu">
                <button onClick={handleLogout} className="ghost-btn">
                  Çıkış Yap
                </button>
                <div className="user-avatar" aria-label={`Kullanıcı: ${user.name}`}>
                  {user.initials}
                </div>
              </div>
            ) : (
              <Link to="/login" className="ghost-btn">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Menubar */}
      <div className="menubar">
        <div className="container menubar__row">
          <Link className="brand" to="/">
            <img src="/agicom.png" alt="AgilionMED Logo" className="logo-img" />
          </Link>

          <nav className="nav">
            {/* 🔥 Her linke onClick handler eklendi */}
            <a className="nav__link active" href="#" onClick={handleNavClick}>
              ANA SAYFA
            </a>
            <a className="nav__link" href="#" onClick={handleNavClick}>
              KURUMSAL
            </a>
            <a className="nav__link" href="#" onClick={handleNavClick}>
              BÖLÜMLERİMİZ
            </a>
            <a className="nav__link" href="#" onClick={handleNavClick}>
              HEKİMLERİMİZ
            </a>
            <a className="nav__link" href="#" onClick={handleNavClick}>
              BİRİMLERİMİZ
            </a>
            <a className="nav__link" href="#" onClick={handleNavClick}>
              EVDE SAĞLIK
            </a>
          </nav>

          <button
            className="hamburger"
            aria-label="Menüyü aç/kapat"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
          >
            <HamburgerIcon isOpen={menuOpen} />
          </button>
        </div>
      </div>

      {/* Mobil Menu Paneli */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__content">
          <button className="mobile-menu__appointment" onClick={closeMenu}>
            Giriş Yap
            <PlusIcon />
          </button>

          <nav className="mobile-menu__nav">
            {/* 🔥 Mobil linklere preventDefault eklendi */}
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>Ana Sayfa</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>Kurumsal</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>Bölümlerimiz</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>Hekimlerimiz</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>Birimlerimiz</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>Evde Sağlık</span>
              <ChevronIcon />
            </a>
          </nav>

          <div className="mobile-menu__section">
            <a className="mobile-menu__link" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
              <span>İletişim</span>
              <ChevronIcon />
            </a>
          </div>

          <div className="mobile-menu__section">
            {user ? (
              <a className="mobile-menu__link mobile-menu__link--login" href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                <span>Çıkış Yap</span>
              </a>
            ) : (
              <a className="mobile-menu__link mobile-menu__link--login" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
                <span>Personel Girişi</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div 
          className="mobile-menu-overlay active" 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}

/* --- İkonlar --- */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3l3 3-2 2a14 14 0 007 7l2-2 3 3-2 3c-6 1-14-7-13-13L6 3z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

function FbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M13 22v-9h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 00-5 5v3H6v4h3v9h4z" />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" ry="4" stroke="currentColor" fill="none" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function HamburgerIcon({ isOpen }) {
  if (isOpen) {
    return (
      <img 
        src="/xmark1.svg" 
        alt="Menüyü kapat" 
        className="xmark-icon"
        width="28" 
        height="28" 
        style={{ display: 'block' }}
      />
    );
  }

  return (
    <img 
      src="/bars.svg" 
      alt="Menüyü aç" 
      className="bars-icon"
      width="28" 
      height="28" 
      style={{ display: 'block' }}
    />
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}