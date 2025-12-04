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
          <div className="footer__logoBlock">
            <img src="/agilion1.svg" alt="AgilionMED" />
          </div>

          {/* Açıklama */}
          <p className="footer__desc">
            Yenilenen yüzümüz ve uzman hekimlerimizle hizmetinizdeyiz!
          </p>

          {/* Bilgi butonları */}
          <div className="footer__list">
            <button className="footer__item" onClick={() => window.location.href = 'https://maps.google.com'}>
              <span className="footer__icon">{/* pin */}</span>
              GEBZE TEKNİK ÜNİVERSİTESİ - PC MÜH BİNASI - Z23
            </button>

            <button className="footer__item" onClick={() => window.location.href = 'mailto:info@agilionmedtıpmerkezi.com.tr'}>
              <span className="footer__icon">{/* mail */}</span>
              info@agilionmedtıpmerkezi.com.tr
            </button>

            <button className="footer__item" onClick={() => window.location.href = 'tel:+902120000000'}>
              <span className="footer__icon">{/* phone */}</span>
              (0212) XXX XX XX
            </button>

            <button className="footer__item" onClick={() => window.location.href = 'tel:+902120000000'}>
              <span className="footer__icon">{/* phone */}</span>
              (0212) XXX XX XX
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
          <h4 className="footer__heading">Bölümlerimiz</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz')}>Acil 7/24</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz')}>Ağız ve Diş Sağlığı</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz')}>Beslenme ve Diyet</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz')}>Kadın Hastalıkları ve Doğum</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz')}>Genel Cerrahi</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz')}>İç Hastalıkları (dahiliye)</button>
          </div>
        </div>
      </div>

      <div className="container footer__row">
        <small>© {new Date().getFullYear()} AgilionMED Tıp Merkezi</small>
        <a href="#"> Aydınlatma Metni</a>
      </div>

    </footer>
  );
}
