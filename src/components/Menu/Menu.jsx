// src/components/Menu/Menu.jsx (SON VE TAM HALİ)

import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { useStaffAuth } from '../../context/StaffAuthContext'; 
import "./Menu.css";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Ekran genişliği masaüstüne çıkınca menüyü kapat (isteğe bağlı, UX için iyi)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 990) setMenuOpen(false);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { user: patientUser, logout: patientLogout } = useAuth(); 
  const { user: staffUser, logout: staffLogout } = useStaffAuth(); 

  const loggedInUser = staffUser || patientUser;
  const isLoggedIn = !!loggedInUser;
  const isStaff = !!staffUser; 
  
  function handleLogout() {
    closeMenu();
    
    if (isStaff) {
      staffLogout();
      // 🔥 Personel çıkış yapınca kendi giriş ekranına dönsün
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
      if (isStaff) {
        switch (staffUser.role) {
          case 'ADMIN': navigate('/personelLogin/admin-panel'); break;
          case 'DOCTOR': navigate('/personelLogin/doctor-panel'); break;
          case 'LAB_TECHNICIAN': navigate('/personelLogin/lab-panel'); break;
          case 'CASHIER': navigate('/personelLogin/cashier-panel'); break;
          case 'CLEANER': navigate('/personelLogin/cleaner-panel'); break;
          default: navigate('/'); break;
        }
      } else if (patientUser) {
        navigate('/'); 
      }
    }
  }

  // ... (Geri kalan useEffect, toggleMenu, JSX ve ikonlar AYNI) ...
  // Kodun uzun olmaması için alt kısımları aynı şekilde koruyabilirsin.
  // Sadece handleLogout mantığı değişti.
  
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
  const handleNavClick = (e) => { };

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar__row">
          <div className="topbar__left">
            <span className="topbar__item"><MailIcon /><a href="mailto:info@medcommercial.com.tr">info@medcommercial.com.tr</a></span>
            <span className="topbar__item"><PhoneIcon /> Çağrı Merkezi: <strong>(212) 000 00 00</strong></span>
          </div>
          <div className="topbar__right">
            <a className="social" href="#"><FbIcon /></a>
            <a className="social" href="#"><IgIcon /></a>
            <span className="lang">TR</span>

            {isLoggedIn ? (
              <div className="user-menu">
                <button onClick={handleLogout} className="ghost-btn">
                  Çıkış Yap ({isStaff ? 'Personel' : 'Hasta'})
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
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "") } to="/">ANA SAYFA</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "") } to="/kurumsal">KURUMSAL</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "") } to="/bolumlerimiz">BÖLÜMLERİMİZ</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "") } to="/hekimlerimiz">HEKİMLERİMİZ</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "") } to="/birimlerimiz">BİRİMLERİMİZ</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "") } to="/evde-saglik">EVDE SAĞLIK</NavLink>
          </nav>
          <button className="hamburger" onClick={toggleMenu}><HamburgerIcon isOpen={menuOpen} /></button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div ref={menuRef} id="mobile-menu" className={`mobile-menu mobile-menu--open`}> 
            <div className="mobile-menu__content">
              <button className="mobile-menu__appointment" onClick={closeMenu}>Hızlı Randevu Al <PlusIcon /></button>
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
            </div>
          </div>
          <div className="mobile-menu-overlay active" onClick={closeMenu} />
        </>
      )}
    </>
  );
}

// --- İKONLAR AYNEN KALIYOR (Kopyala yapıştır yapabilirsin) ---
function MailIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>; }
function PhoneIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 3l3 3-2 2a14 14 0 007 7l2-2 3 3-2 3c-6 1-14-7-13-13L6 3z" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>; }
function FbIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M13 22v-9h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 00-5 5v3H6v4h3v9h4z" /></svg>; }
function IgIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" ry="4" stroke="currentColor" fill="none" /><circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" /><circle cx="17" cy="7" r="1.2" fill="currentColor" /></svg>; }
function HamburgerIcon({ isOpen }) { return isOpen ? <img src="/xmark1.svg" className="xmark-icon" width="28" height="28" /> : <img src="/bars.svg" className="bars-icon" width="28" height="28" />; }
function PlusIcon() { return <svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>; }
function ChevronIcon() { return <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>; }