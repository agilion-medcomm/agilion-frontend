import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ExpertSection.css";

export default function ExpertSection() {
  const navigate = useNavigate();
  const { t } = useTranslation(['home']);

  return (
    <section className="expert-section">
      <div className="expert-container">

        <div className="expert-image">
          <img src="/uzman1.jpg" alt="Uzman hekim ve hasta" />
        </div>

        <div className="expert-content">
          <h2>{t('home:expert.title')}</h2>
          <p>
            {t('home:expert.text')}
          </p>

          <div className="expert-actions">

            <div className="call-box">
              <h4>{t('home:expert.call_center_title')}</h4>
              <p className="subtitle">{t('home:expert.call_center_sub')}</p>
              <p className="phone">
                <img src="/phone.svg" alt="" className="phone-icon" /> (0212) 665 70 10
              </p>
            </div>

            <div className="expert-buttons">
              <button className="outline-btn" onClick={() => navigate('/hekimlerimiz')}>
                <img src="/details.svg" alt="" className="btn-icon" /> {t('home:expert.explore')}
              </button>
              <button className="outline-btn" onClick={() => window.open('https://maps.app.goo.gl/Y4Sd4PxT5nv51niW6', '_blank')}>
                <img src="/map.svg" alt="" className="btn-icon" /> {t('home:expert.address')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
