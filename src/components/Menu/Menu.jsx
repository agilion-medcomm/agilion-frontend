// src/components/Menu/Menu.jsx (SON VE TAM HALİ - HIZLI RANDEVU EKLEMESİ YAPILDI)

import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
// Appointment modals removed — randevu sayfası kullanılacak
import "./Menu.css";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();



  const { user: patientUser, logout: patientLogout } = useAuth();
  const { user: personnelUser, logout: personnelLogout } = usePersonnelAuth();

  const loggedInUser = personnelUser || patientUser;
  const isLoggedIn = !!loggedInUser;
  const isPersonnel = !!personnelUser;

  function handleLogout() {
    closeMenu();

    if (isPersonnel) {
      personnelLogout();
      // Personel çıkış yapınca kendi giriş ekranına dönsün
      navigate('/personelLogin', { replace: true });
    } else if (patientUser) {
      patientLogout();
      // Hasta çıkış yapınca ana sayfaya dönsün
      navigate('/', { replace: true });
    }
  }

  function handleAvatarClick() {
    if (loggedInUser) {
      closeMenu();
      if (isPersonnel) {
        switch (personnelUser.role) {
          case 'ADMIN': navigate('/admin-panel'); break;
          case 'DOCTOR': navigate('/doctor-panel'); break;
          case 'LABORANT': navigate('/dashboard/laborant'); break;
          default: navigate('/'); break;
        }
      } else if (patientUser) {
        navigate('/profile');
      }
    }
  }

  // 🔥 HAMBURGER BUTON İŞLEVİ
  const handleHizliRandevuClick = (e) => {
    e.preventDefault(); // Varsayılan link davranışını engelle
    closeMenu(); // Menüyü kapat

    // 1. Kural: Kullanıcı login değilse, login sayfasına yönlendir.
    if (!patientUser) {
      alert("Randevu alabilmek için önce giriş yapınız.");
      navigate('/login');
      return;
    }
    // 2. Kural: Kullanıcı login ise, randevu sayfasına yönlendir.
    navigate('/randevu');
  };

  // artık modal state'leri yok


  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Menü açıkken route değişirse menüyü kapat
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Ekran genişliği masaüstüne çıkınca menüyü kapat
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 990) setMenuOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuOpen) return;

      const hamburgerBtn = document.querySelector('.hamburger');
      if (hamburgerBtn && hamburgerBtn.contains(e.target)) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  function toggleMenu() { setMenuOpen(prev => !prev); }
  function closeMenu() { setMenuOpen(false); }

  // Not: FloatingButtons.jsx'teki ikon placeholder'ları buraya taşındı (Empty SVG'ler yerine)
  const CalendarIconPlaceholder = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 2V5M16 2V5M3 8H21M7 12H9M11 12H13M15 12H17M3 16H21M7 20H9M11 20H13M15 20H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>


  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar__row">
          <div className="topbar__left">
            <span className="topbar__item"><MailIcon /><a href="mailto:info@medcommercial.com.tr">agilion@medcomm.com.tr</a></span>
            <span className="topbar__item"><PhoneIcon /> Çağrı Merkezi: <strong>(212) 000 00 00</strong></span>
          </div>
          <div className="topbar__right">
            <a className="social" href="#"><FbIcon /></a>
            <a className="social" href="#"><IgIcon /></a>
            <span className="lang">TR</span>

            {isLoggedIn ? (
              <div className="user-menu">
                <button onClick={handleLogout} className="ghost-btn">
                  Çıkış Yap ({isPersonnel ? 'Personel' : 'Hasta'})
                </button>
                <div className="user-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }} title={`${loggedInUser.firstName} ${loggedInUser.lastName}`}>
                  {loggedInUser.firstName?.charAt(0).toUpperCase()}
                  {loggedInUser.lastName?.charAt(0).toUpperCase()}
                </div>

              </div>
            ) : (
              <Link to="/login" className="ghost-btn">Giriş Yap</Link>
            )}
          </div>
        </div>
      </div>

      {/* Menubar */}
      <div className="menubar">
        <div className="container menubar__row">
          <Link className="brand" to="/"><img src="/agicom.png" alt="AgilionMED Logo" className="logo-img" /></Link>
          <nav className="nav">
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/">ANA SAYFA</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/kurumsal">KURUMSAL</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/bolumlerimiz">BÖLÜMLERİMİZ</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/hekimlerimiz">HEKİMLERİMİZ</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/birimlerimiz">BİRİMLERİMİZ</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/evde-saglik">EVDE SAĞLIK</NavLink>
          </nav>
          <button className="hamburger" onClick={toggleMenu}><HamburgerIcon isOpen={menuOpen} /></button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div ref={menuRef} id="mobile-menu" className={`mobile-menu mobile-menu--open`}>
            <div className="mobile-menu__content">
              {/* 🔥 HAMBURGER MENÜ BUTON DÜZELTMESİ */}
              <button className="mobile-menu__appointment" onClick={handleHizliRandevuClick}>
                Hızlı Randevu Al <CalendarIconPlaceholder />
              </button>

              {/* Giriş Yap / User Actions - Moved Here */}
              <div className="mobile-menu__auth-section" style={{ marginBottom: '20px' }}>
                {isLoggedIn ? (
                  <div className="mobile-menu__user-actions">
                    <div className="user-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer', margin: '0 auto' }} title={`${loggedInUser.firstName} ${loggedInUser.lastName}`}>
                      {loggedInUser.firstName?.charAt(0).toUpperCase()}
                      {loggedInUser.lastName?.charAt(0).toUpperCase()}
                    </div>
                    <button onClick={handleLogout} className="mobile-menu__login-btn" style={{ background: '#d32f2f', marginTop: 8 }}>
                      Çıkış Yap ({isPersonnel ? 'Personel' : 'Hasta'})
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="mobile-menu__login-btn" onClick={closeMenu}>
                    Giriş Yap
                  </Link>
                )}
              </div>

              <nav className="mobile-menu__nav">
                <Link className="mobile-menu__link" to="/" onClick={closeMenu}><span>Ana Sayfa</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/kurumsal" onClick={closeMenu}><span>Kurumsal</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/bolumlerimiz" onClick={closeMenu}><span>Bölümlerimiz</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/hekimlerimiz" onClick={closeMenu}><span>Hekimlerimiz</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/birimlerimiz" onClick={closeMenu}><span>Birimlerimiz</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/evde-saglik" onClick={closeMenu}><span>Evde Sağlık</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/contact" onClick={closeMenu}><span>İletişim</span> <ChevronIcon /></Link>
              </nav>

              {isLoggedIn ? (
                <div style={{ borderTop: '1px solid #eee', marginTop: 16, paddingTop: 8 }}>
                  <a className="mobile-menu__link mobile-menu__link--login" href="#" style={{ color: '#d32f2f', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <span>Çıkış Yap</span>
                  </a>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid #eee', marginTop: 16, paddingTop: 8 }}>
                  <Link to="/personelLogin" className="mobile-menu__link mobile-menu__link--login" onClick={closeMenu}><span>Personel Girişi</span></Link>
                </div>
              )}

              {/* 780px ve altı için Topbar İçerikleri - Moved to Bottom */}
              <div className="mobile-menu__topbar-items">
                <a href="mailto:info@medcommercial.com.tr" className="mobile-menu__info-item">
                  <MailIcon /> agilion@medcomm.com.tr
                </a>
                <a href="tel:2120000000" className="mobile-menu__info-item">
                  <PhoneIcon /> Çağrı Merkezi: <strong>(212) 000 00 00</strong>
                </a>

                <div className="mobile-menu__socials-row">
                  <a className="social" href="#"><FbIcon /></a>
                  <a className="social" href="#"><IgIcon /></a>
                  <span className="lang">TR</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-menu-overlay active" onClick={closeMenu} />
        </>
      )}

      {/* Randevu artık ayrı sayfada yönetiliyor ("/randevu") */}
    </>
  );
}

// --- İKONLAR ---
function MailIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>; }
function PhoneIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 3l3 3-2 2a14 14 0 007 7l2-2 3 3-2 3c-6 1-14-7-13-13L6 3z" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>; }
function FbIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M13 22v-9h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 00-5 5v3H6v4h3v9h4z" /></svg>; }
function IgIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" ry="4" stroke="currentColor" fill="none" /><circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" /><circle cx="17" cy="7" r="1.2" fill="currentColor" /></svg>; }
function HamburgerIcon({ isOpen }) { return isOpen ? <img src="/xmark1.svg" className="xmark-icon" width="28" height="28" /> : <img src="/bars.svg" className="bars-icon" width="28" height="28" />; }
function ChevronIcon() { return <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>; }

// Footer'daki gibi boş SVG'ler yerine placeholder ikon kullanıldı.
// Bu, Menu.jsx içindeki CalendarIconPlaceholder fonksiyonu ile aynıdır.
// (Appointment'da da bu kodun olmaması gerekiyordu, ancak kod tekrarını önlemek için buraya ekledim.)
function CalendarIconPlaceholder() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 2V5M16 2V5M3 8H21M7 12H9M11 12H13M15 12H17M3 16H21M7 20H9M11 20H13M15 20H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>; }