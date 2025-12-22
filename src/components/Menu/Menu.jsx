// src/components/Menu/Menu.jsx (SON VE TAM HALİ - HIZLI RANDEVU EKLEMESİ YAPILDI)

import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
// Appointment modals removed — randevu sayfası kullanılacak
import "./Menu.css";

export default function Menu() {
  const { t, i18n } = useTranslation(['common']);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };



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

  // HAMBURGER BUTON İŞLEVİ
  const handleHizliRandevuClick = (e) => {
    e.preventDefault(); // Varsayılan link davranışını engelle
    closeMenu(); // Menüyü kapat

    // 1. Kural: Kullanıcı login değilse, login sayfasına yönlendir.
    if (!patientUser) {
      alert(t('common:please_login_to_book'));
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
      if (window.innerWidth > 950) setMenuOpen(false);
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
            <span className="topbar__item"><MailIcon /><a href="mailto:info@medcommercial.com.tr">info@zeytinburnutipmerkezi.com.tr</a></span>
            <span className="topbar__item"><PhoneIcon /> {t('common:call_center')}: <strong>(212) 665 70 10</strong></span>
          </div>
          <div className="topbar__right">
            <a className="social" href="#"><FbIcon /></a>
            <a className="social" href="#"><IgIcon /></a>
            <button
              className="lang-toggle-btn"
              onClick={toggleLanguage}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold', fontSize: '14px', padding: '0 5px' }}
            >
              {i18n.language?.toUpperCase() === 'TR' ? 'EN' : 'TR'}
            </button>
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={theme === 'light' ? 'Karanlık Mod' : 'Aydınlık Mod'}
              style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '10px', padding: '0', display: 'flex', alignItems: 'center' }}
            >
              <img src={theme === 'light' ? "/sun.svg" : "/moon.svg"} width="20" height="20" alt="Theme Toggle" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>

            {isLoggedIn ? (
              <div className="user-menu">
                <button onClick={handleLogout} className="ghost-btn">
                  {t('common:logout')} ({isPersonnel ? t('common:personnel') : t('common:patient')})
                </button>
                <div className="user-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }} title={`${loggedInUser.firstName} ${loggedInUser.lastName}`}>
                  {loggedInUser.firstName?.charAt(0).toUpperCase()}
                  {loggedInUser.lastName?.charAt(0).toUpperCase()}
                </div>

              </div>
            ) : (
              <Link to="/login" className="ghost-btn">{t('common:login')}</Link>
            )}
          </div>
        </div>
      </div>

      {/* Menubar */}
      <div className="menubar">
        <div className="container menubar__row">
          <Link className="brand" to="/"><img src={theme === 'light' ? "/logo1.png" : "/logo_dark.png"} alt="AgilionMED Logo" className="logo-img" /></Link>
          <nav className="nav">
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/">{t('common:home')}</NavLink>
            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/kurumsal">{t('common:corporate')}</NavLink>

            <div className="nav__dropdown-wrapper">
              <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/bolumlerimiz">{t('common:departments')}</NavLink>
              <div className="nav__dropdown">
                <ul>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'acil' }}>{t('common:depts.emergency')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'dis' }}>{t('common:depts.dental')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'diyet' }}>{t('common:depts.nutrition')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'derma' }}>{t('common:depts.dermatology')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'cerrahi' }}>{t('common:depts.surgery')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'goz' }}>{t('common:depts.eye')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'dahiliye' }}>{t('common:depts.internal')}</Link></li>
                  <li><Link to="/bolumlerimiz" state={{ selectedId: 'kadin' }}>{t('common:depts.women')}</Link></li>
                </ul>
              </div>
            </div>

            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/hekimlerimiz">{t('common:doctors')}</NavLink>

            <div className="nav__dropdown-wrapper">
              <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/birimlerimiz">{t('common:units')}</NavLink>
              <div className="nav__dropdown">
                <ul>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'anestezi' }}>{t('common:unit_list.anesthesia')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'ameliyathane' }}>{t('common:unit_list.surgery_room')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'dogumhane' }}>{t('common:unit_list.delivery_room')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'rontgen' }}>{t('common:unit_list.xray')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'laboratuvar' }}>{t('common:unit_list.lab')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'fizik' }}>{t('common:unit_list.pt')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'saglik_raporlari' }}>{t('common:unit_list.reports')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'ultrason' }}>{t('common:unit_list.ultrasound')}</Link></li>
                  <li><Link to="/birimlerimiz" state={{ selectedId: 'solunum' }}>{t('common:unit_list.resp')}</Link></li>
                </ul>
              </div>
            </div>

            <NavLink className={({ isActive }) => "nav__link" + (isActive ? " active" : "")} to="/evde-saglik">{t('common:home_health')}</NavLink>
          </nav>
          <button className="hamburger" onClick={toggleMenu}><HamburgerIcon isOpen={menuOpen} /></button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div ref={menuRef} id="mobile-menu" className={`mobile-menu mobile-menu--open`}>
            <div className="mobile-menu__content">
              {isLoggedIn ? (
                <>
                  {/* A. Kişiye Özel Alan (Header) */}
                  <div className="mobile-menu__profile-card">
                    <div className="mobile-menu__profile-main" onClick={handleAvatarClick}>
                      <div className="user-avatar">
                        {loggedInUser.firstName?.charAt(0).toUpperCase()}
                        {loggedInUser.lastName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="mobile-menu__profile-info">
                        <div className="mobile-menu__profile-name">{loggedInUser.firstName} {loggedInUser.lastName}</div>
                        <div className="mobile-menu__profile-role">
                          {isPersonnel
                            ? (personnelUser.role === 'ADMIN' ? t('common:admin') : (personnelUser.role === 'DOCTOR' ? t('common:doctor') : t('common:personnel')))
                            : (loggedInUser.tckn ? `TCKN: ${loggedInUser.tckn.substring(0, 3)}***` : t('common:patient'))}
                        </div>
                      </div>
                    </div>
                    <button className="mobile-menu__settings-btn" onClick={() => navigate(isPersonnel ? '/profile-settings' : '/profile')} title={t('common:profile_settings')}>
                      <img src="/angle-right.svg" alt="" width="24" height="24" />
                    </button>
                  </div>

                  {/* B. Hızlı Randevu Al (Aksiyon Butonu) - Full Width for Logged In */}
                  <button className="mobile-menu__hizli-randevu--full" onClick={handleHizliRandevuClick}>
                    {t('common:book_appointment')} <img src="/appointment.svg" alt="" width="24" height="24" style={{ filter: 'brightness(0) invert(1)' }} />
                  </button>
                </>
              ) : (
                /* Giriş Yapılmamışken: Yan Yana Butonlar */
                <div className="mobile-menu__top-buttons">
                  <button className="mobile-menu__hizli-randevu--half" onClick={handleHizliRandevuClick}>
                    {t('common:book_appointment_short')} <img src="/appointment.svg" alt="" width="20" height="20" style={{ filter: 'brightness(0) invert(1)' }} />
                  </button>
                  <Link to="/login" className="mobile-menu__login-btn--half" onClick={closeMenu}>
                    {t('common:login')}
                  </Link>
                </div>
              )}

              <nav className="mobile-menu__nav">
                <Link className="mobile-menu__link" to="/" onClick={closeMenu}><span>{t('common:home')}</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/kurumsal" onClick={closeMenu}><span>{t('common:corporate')}</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/bolumlerimiz" onClick={closeMenu}><span>{t('common:departments')}</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/hekimlerimiz" onClick={closeMenu}><span>{t('common:doctors')}</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/birimlerimiz" onClick={closeMenu}><span>{t('common:units')}</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/evde-saglik" onClick={closeMenu}><span>{t('common:home_health')}</span> <ChevronIcon /></Link>
                <Link className="mobile-menu__link" to="/contact" onClick={closeMenu}><span>{t('common:contact')}</span> <ChevronIcon /></Link>
              </nav>

              {isLoggedIn ? (
                <div style={{ borderTop: '1px solid #eee', marginTop: 16, paddingTop: 8 }}>
                  <a className="mobile-menu__link mobile-menu__link--login" href="#" style={{ color: '#d32f2f', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                    <span>{t('common:logout')}</span>
                  </a>
                </div>
              ) : (
                <div style={{ borderTop: '1px solid #eee', marginTop: 16, paddingTop: 8 }}>
                  <Link to="/personelLogin" className="mobile-menu__link mobile-menu__link--login" onClick={closeMenu}><span>{t('common:personnel_login')}</span></Link>
                </div>
              )}

              {/* 950px ve altı için Topbar İçerikleri - Moved to Bottom */}
              <div className="mobile-menu__topbar-items">
                <a href="mailto:info@medcommercial.com.tr" className="mobile-menu__info-item">
                  <MailIcon /> info@zeytinburnutipmerkezi.com.tr
                </a>
                <a href="tel:2120000000" className="mobile-menu__info-item">
                  <PhoneIcon /> {t('common:call_center')}: <strong>(212) 665 70 10</strong>
                </a>

                <div className="mobile-menu__socials-row">
                  <a className="social" href="#"><FbIcon /></a>
                  <a className="social" href="#"><IgIcon /></a>
                  <button
                    className="lang-toggle-btn-mobile"
                    onClick={toggleLanguage}
                    style={{ background: 'none', border: '1px solid #ddd', borderRadius: '50%', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                  >
                    {i18n.language?.toUpperCase() === 'TR' ? 'EN' : 'TR'}
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="theme-toggle-btn-mobile"
                    style={{ background: 'none', border: '1px solid #ddd', borderRadius: '50%', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }}
                  >
                    <img src={theme === 'light' ? "/sun.svg" : "/moon.svg"} width="18" height="18" alt="Theme Toggle" />
                  </button>
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
function MailIcon() { return <img src="/mailicon.svg" width="18" height="18" alt="" style={{ verticalAlign: 'middle', filter: 'brightness(0) invert(1)' }} />; }
function PhoneIcon() { return <img src="/phone.svg" width="18" height="18" alt="" style={{ verticalAlign: 'middle', filter: 'brightness(0) invert(1)' }} />; }
function FbIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M13 22v-9h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 00-5 5v3H6v4h3v9h4z" /></svg>; }
function IgIcon() { return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" ry="4" stroke="currentColor" fill="none" /><circle cx="12" cy="12" r="4" stroke="currentColor" fill="none" /><circle cx="17" cy="7" r="1.2" fill="currentColor" /></svg>; }
function HamburgerIcon({ isOpen }) { return isOpen ? <img src="/xmark1.svg" className="xmark-icon" width="28" height="28" /> : <img src="/bars.svg" className="bars-icon" width="28" height="28" />; }
function ChevronIcon() { return <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>; }
function SettingsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}


// Footer'daki gibi boş SVG'ler yerine placeholder ikon kullanıldı.
// Bu, Menu.jsx içindeki CalendarIconPlaceholder fonksiyonu ile aynıdır.
// (Appointment'da da bu kodun olmaması gerekiyordu, ancak kod tekrarını önlemek için buraya ekledim.)
function CalendarIconPlaceholder() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 2V5M16 2V5M3 8H21M7 12H9M11 12H13M15 12H17M3 16H21M7 20H9M11 20H13M15 20H17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>; }