import "./App.css";

export default function App() {
  return (
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

          <button className="hamburger" aria-label="Menüyü aç/kapat">
            <HamburgerIcon />
          </button>
        </div>
      </div>

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
function HamburgerIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function LogoMark() {
  return (
    <svg className="logomark" width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="#2CB5E0"/>
      <rect x="9" y="18" width="22" height="4" rx="2" fill="#fff"/>
      <rect x="18" y="9" width="4" height="22" rx="2" fill="#fff"/>
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2zm6-6V11a6 6 0 10-12 0v5L4 18v2h16v-2l-2-2z" fill="currentColor"/>
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
function HeartSwoosh() {
  return (
    <svg width="260" height="40" viewBox="0 0 260 40" aria-hidden>
      <path d="M5 20c40 40 80-40 120 0 40 40 80-40 120 0" fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth="2"/>
      <path d="M120 18c3-6 10-6 13 0 2 4-1 8-6 11-5-3-8-7-7-11z" fill="currentColor" fillOpacity=".3"/>
    </svg>
  );
}
function StopwatchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M12 13V9m-3-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function CallIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 3l3 3-2 2a14 14 0 007 7l2-2 3 3-2 3c-6 1-14-7-13-13L6 3z" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  );
}
