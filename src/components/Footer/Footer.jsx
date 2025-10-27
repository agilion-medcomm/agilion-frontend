import React from "react";
import "./Footer.css";

export default function Footer() {
  // Şimdilik placeholder işlevler — backend/route hazır olunca dolduracağız
  const handleClick = (what) => () => console.log(`[Footer] click: ${what}`);

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

          {/* Bilgi butonları (şimdilik buton; sonra yönlendirme/aksiyon eklenecek) */}
          <div className="footer__list">
            <button className="footer__item" onClick={handleClick("address")}>
              <span className="footer__icon">{/* pin */}</span>
              GEBZE TEKNİK ÜNİVERSİTESİ - PC MÜH BİNASI - Z23
            </button>

            <button className="footer__item" onClick={handleClick("email")}>
              <span className="footer__icon">{/* mail */}</span>
              info@agilionmedtıpmerkezi.com.tr
            </button>

            <button className="footer__item" onClick={handleClick("phone1")}>
              <span className="footer__icon">{/* phone */}</span>
              (0212) XXX XX XX
            </button>

            <button className="footer__item" onClick={handleClick("phone2")}>
              <span className="footer__icon">{/* phone */}</span>
              (0212) XXX XX XX
            </button>
          </div>
        </div>

        {/* ORTA SÜTUN */}
        <div className="footer__col">
          <h4 className="footer__heading">KURUMSAL</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={handleClick("hakkimizda")}>Hakkımızda</button>
            <button className="footer__link" onClick={handleClick("hekimlerimiz")}>Hekimlerimiz</button>
            <button className="footer__link" onClick={handleClick("iletisim")}>İletişim</button>
          </div>
        </div>

        {/* SAĞ SÜTUN */}
        <div className="footer__col">
          <h4 className="footer__heading">Tıbbi Birimlerimiz</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={handleClick("acil")}>Acil 7/24</button>
            <button className="footer__link" onClick={handleClick("dis")}>Ağız ve Diş Sağlığı</button>
            <button className="footer__link" onClick={handleClick("diyet")}>Beslenme ve Diyet</button>
            <button className="footer__link" onClick={handleClick("kadin")}>Kadın Hastalıkları ve Doğum</button>
            <button className="footer__link" onClick={handleClick("cerrahi")}>Genel Cerrahi</button>
            <button className="footer__link" onClick={handleClick("dahiliye")}>İç Hastalıkları (dahiliye)</button>
          </div>
        </div>
      </div>

        <div className="container footer__row">
            <small>© {new Date().getFullYear()} AgilionMED Tıp Merkezi</small>
            <a href="#">Aydınlatma Metni</a>
          </div>

    </footer>
  );
}
