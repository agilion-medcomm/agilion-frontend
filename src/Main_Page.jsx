import React, { useState, useRef, useEffect } from 'react';
import './Main_Page.css';

export default function MainPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // close on escape
    useEffect(() => {
      function onKey(e){
        if(e.key === 'Escape') setMenuOpen(false);
      }
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    },[]);

    // close when clicking outside the menu panel
    useEffect(() => {
      function onDocClick(e){
        if(!menuOpen) return;
        if(menuRef.current && !menuRef.current.contains(e.target)){
          setMenuOpen(false);
        }
      }

      document.addEventListener('mousedown', onDocClick);
      return () => document.removeEventListener('mousedown', onDocClick);
    }, [menuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
      if(menuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [menuOpen]);

    function toggleMenu(){ setMenuOpen(v => !v); }

    function closeMenu(){ setMenuOpen(false); }

    return (
        <div className="main-page">
            <div className="site">
      {/* Fixed CONTACT BAR */}
      <div className="topbar">
        <div className="container topbar__row">
          <div className="topbar__left">
            <span className="topbar__item">
              <MailIcon />
              <a href="mailto:info@medcommercial.com.tr">info@medcommercial.com.tr</a>
            </span>
            <span className="divider" />
            <span className="topbar__item">
              <PhoneIcon /> Çağrı Merkezi: <strong>(212) 000 00 00</strong>
            </span>
          </div>
          <div className="topbar__right">
            <a className="social" href="#" aria-label="Facebook"><FbIcon /></a>
            <a className="social" href="#" aria-label="Instagram"><IgIcon /></a>
            <span className="lang">TR</span>
            <button className="ghost-btn">Giriş Yap</button>
          </div>
        </div>
      </div>

      {/* Fixed MENU BAR */}
      <div className="menubar">
        <div className="container menubar__row">
          <a className="brand" href="#">
            <img src="/agilion1.png" alt="AgilionMED Logo" className="logo-img" />
          </a>

          <nav className="nav">
            <a className="nav__link active" href="#">ANA SAYFA</a>
            <a className="nav__link" href="#">KURUMSAL</a>
            <a className="nav__link" href="#">BÖLÜMLERİMİZ</a>
            <a className="nav__link" href="#">HEKİMLERİMİZ</a>
            <a className="nav__link" href="#">BİRİMLERİMİZ</a>
            <a className="nav__link" href="#">EVDE SAĞLIK</a>
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

      {/* MOBILE MENU PANEL */}
      <div 
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__content">
          {/* Hızlı Randevu Button */}
          <button className="mobile-menu__appointment">
            Hızlı Randevu Al
            <PlusIcon />
          </button>

          {/* Navigation Links */}
          <nav className="mobile-menu__nav">
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>Ana Sayfa</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>Kurumsal</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>Bölümlerimiz</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>Hekimlerimiz</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>Birimlerimiz</span>
              <ChevronIcon />
            </a>
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>Evde Sağlık</span>
              <ChevronIcon />
            </a>
          </nav>

          {/* İletişim Section */}
          <div className="mobile-menu__section">
            <a className="mobile-menu__link" href="#" onClick={closeMenu}>
              <span>İletişim</span>
              <ChevronIcon />
            </a>
          </div>

          {/* Personel Girişi */}
          <div className="mobile-menu__section">
            <a className="mobile-menu__link mobile-menu__link--login" href="#" onClick={closeMenu}>
              <span>Personel Girişi</span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && <div className="mobile-menu-overlay" onClick={closeMenu}></div>}

      {/* MAIN CONTENT (offset added via CSS vars) */}
      <main className="main">
        {/* HERO */}
      <section className="hero">
        <div className="hero__image">
          <img src="/cover.png" alt="AgilionMED Hero Görseli" />
          <div className="hero__overlay"></div>
        </div>

        {/* Arama kutusu (görselin alt kısmında, ortada) */}
        <div className="hero__searchbox">
          <div className="search">
            <input
              className="search__input"
              type="text"
              placeholder="Size nasıl yardımcı olabiliriz?"
              aria-label="Soru veya hizmet arayın"
            />
            <button className="search__btn" aria-label="Ara">
              <SearchIcon />
            </button>
          </div>
        </div>
      </section>

      </main>

      <footer className="footer">
        <div className="container footer__row">
          <small>© {new Date().getFullYear()} AgilionMED Tıp Merkezi</small>
          <a href="#">Aydınlatma Metni</a>
        </div>
      </footer>
    </div>
  </div>
  );
}

/* ---------------- Icons (inline SVG) ---------------- */
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 3l3 3-2 2a14 14 0 007 7l2-2 3 3-2 3c-6 1-14-7-13-13L6 3z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
    </svg>
  );
}
function FbIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M13 22v-9h3l1-4h-4V7c0-1.1.9-2 2-2h2V1h-3a5 5 0 00-5 5v3H6v4h3v9h4z"/>
    </svg>
  );
}
function IgIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="4" ry="4" stroke="currentColor" fill="none"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" fill="none"/>
      <circle cx="17" cy="7" r="1.2" fill="currentColor"/>
    </svg>
  );
}
function HamburgerIcon({ isOpen }) {
  return (
    <svg className={`hamburger-icon ${isOpen ? 'open' : ''}`} width="28" height="28" viewBox="0 0 24 24" aria-hidden>
   
      <path className="line line1" d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="line line2" d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="line line3" d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}