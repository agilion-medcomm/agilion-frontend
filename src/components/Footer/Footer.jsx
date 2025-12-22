import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation(['footer', 'common']);

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* SOL SÜTUN */}
        <div className="footer__col footer__col--left">
          {/* Logo bloğu */}
          <div className="footer__logoBlock" onClick={() => navigate('/')}>
            <h2 className="footer__logoText">{t('footer:logo_text')}</h2>
          </div>

          {/* Açıklama */}
          <p className="footer__desc">
            {t('footer:desc')}
          </p>

          {/* Bilgi butonları */}
          <div className="footer__list">
            <button className="footer__item" onClick={() => window.location.href = 'https://maps.google.com'}>
              <span className="footer__icon">{/* pin */}</span>
              {t('footer:address')}
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
          <h4 className="footer__heading">{t('footer:headings.corporate')}</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={() => navigate('/kurumsal')}>{t('footer:links.about')}</button>
            <button className="footer__link" onClick={() => navigate('/hekimlerimiz')}>{t('footer:links.doctors')}</button>
            <button className="footer__link" onClick={() => navigate('/contact')}>{t('footer:links.contact')}</button>
          </div>
        </div>

        {/* SAĞ SÜTUN */}
        <div className="footer__col">
          <h4 className="footer__heading">{t('footer:headings.departments')}</h4>
          <div className="footer__menu">
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'acil' } })}>{t('common:depts.emergency')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'dis' } })}>{t('common:depts.dental')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'diyet' } })}>{t('common:depts.nutrition')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'derma' } })}>{t('common:depts.dermatology')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'cerrahi' } })}>{t('common:depts.surgery')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'goz' } })}>{t('common:depts.eye')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'dahiliye' } })}>{t('common:depts.internal')}</button>
            <button className="footer__link" onClick={() => navigate('/bolumlerimiz', { state: { selectedId: 'kadin' } })}>{t('common:depts.women')}</button>
          </div>
        </div>
      </div>

      <div className="container footer__row">
        <small>{t('footer:copyright', { year: new Date().getFullYear() })}</small>
        <a href="/aydinlatma-metni" target="_blank" rel="noopener noreferrer"> {t('footer:lighting_text')}</a>
      </div>

    </footer>
  );
}
