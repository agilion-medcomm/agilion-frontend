import React, { useState, useRef, useEffect } from 'react';

export default function MobileMenu() {
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
        <>
            {/* Hamburger Button */}
            <button
                className="hamburger"
                aria-label="Menüyü aç/kapat"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={toggleMenu}
            >
                <HamburgerIcon isOpen={menuOpen} />
            </button>

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
        </>
    );
}

/* ---------------- Icons (inline SVG) ---------------- */
function HamburgerIcon({ isOpen }) {
  return (
    <svg className={`hamburger-icon ${isOpen ? 'open' : ''}`} width="28" height="28" viewBox="0 0 24 24" aria-hidden>
   
      <path className="line line1" d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="line line2" d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path className="line line3" d="M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
