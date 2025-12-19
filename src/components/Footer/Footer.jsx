import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* SOL SÜTUN */}
        <div className="footer__col footer__col--left">
          {/* Logo bloğu */}
          <div className="footer__logoBlock" onClick={() => navigate('/')}>
            <h2 className="footer__logoText">Zeytinburnu Tıp Merkezi</h2>
          </div>

          {/* Açıklama */}
          <p className="footer__desc">
            Yenilenen yüzümüz ve uzman hekimlerimizle hizmetinizdeyiz!
          </p>

          {/* Bilgi butonları */}
          <div className="footer__list">
            <button className="footer__item" onClick={() => window.location.href = 'https://maps.google.com'}>
              <span className="footer__icon">{/* pin */}</span>
              Yenidoğan Mah. 50 Sok. No :22
              Zeytinburnu/İstanbul
            </button>

            <button className="footer__item" onClick={() => window.location.href = 'mailto:info@agilionmedtıpmerkezi.com.tr'}>
              <span className="footer__icon">{/* mail */}</span>
              info@zeytinburnutipmerkezi.com.tr
            </button>

            <button className="footer__item" onClick={() => window.location.href = 'tel:+902126657010'}>
              <span className="footer__icon">{/* phone */}</span>
              +90 (212) 665 70 10
            </button>

            <button className="footer__item" onClick={() => window.location.href = 'tel:+902125584052'}>
              <span className="footer__icon">{/* phone */}</span>
              +90 (212) 558 40 52
            </button>
          </div>
        </div>

        {/* ORTA SÜTUN */}
        <div className="footer__col">
          <h4 className="footer__heading">KURUMSAL</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={() => navigate('/kurumsal')}>Hakkımızda</button>
            <button className="footer__link" onClick={() => navigate('/hekimlerimiz')}>Hekimlerimiz</button>
            <button className="footer__link" onClick={() => navigate('/contact')}>İletişim</button>
          </div>
        </div>

        {/* SAĞ SÜTUN */}
        <div className="footer__col">
          <h4 className="footer__heading">BÖLÜMLERİMİZ</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'acil' } })}>Acil 7/24</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'dis' } })}>Ağız ve Diş Sağlığı</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'diyet' } })}>Beslenme ve Diyet</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'derma' } })}>Dermatoloji</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'cerrahi' } })}>Genel Cerrahi</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'goz' } })}>Göz Sağlığı</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'dahiliye' } })}>İç Hastalıklar/Dahiliye</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'kadin' } })}>Kadın Hastalıkları ve Doğum</button>
          </div>
        </div>
      </div>

      <div className="container footer__row">
        <small>© {new Date().getFullYear()} Zeytinburnu Tıp Merkezi</small>
        <a href="#"> Aydınlatma Metni</a>
      </div>

    </footer>
  );
}
