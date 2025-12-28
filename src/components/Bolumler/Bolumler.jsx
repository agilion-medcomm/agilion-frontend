import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Bolumler.css";

export default function Bolumler() {
  const navigate = useNavigate();
  const { t } = useTranslation(['home', 'common']);

  const services = [
    { id: "acil", title: t('common:depts.emergency'), img: "/b11.png", color: "red" },
    { id: "dis", title: t('common:depts.dental'), img: "/b22.png", color: "blue" },
    { id: "diyet", title: t('common:depts.nutrition'), img: "/b3diyet.png", color: "blue" },
    { id: "derma", title: t('common:depts.dermatology'), img: "/b44.png", color: "blue" },
    { id: "cerrahi", title: t('common:depts.surgery'), img: "/b55.png", color: "blue" },
    { id: "goz", title: t('common:depts.eye'), img: "/b6goz.png", color: "blue" },
    { id: "dahiliye", title: t('common:depts.internal'), img: "/b77.png", color: "blue" },
    { id: "kadin", title: t('common:depts.women'), img: "/b88.png", color: "blue" },
  ];

  const handleNavigate = (id) => {
    navigate("/bolumlerimiz", { state: { selectedId: id } });
    window.scrollTo(0, 0);
  };

  return (
    <section className="bolumler-section">

      <h2 className="bolumler-title">
        {t('home:bolumler.title')}
      </h2>

      <div className="bolumler-grid">
        {services.map((item, i) => (
          <div
            key={i}
            className={`bolum-card ${item.color === "red" ? "red" : ""}`}
            onClick={() => handleNavigate(item.id)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <button onClick={(e) => {
              e.stopPropagation();
              handleNavigate(item.id);
            }}>{t('home:bolumler.examine')}</button>
          </div>
        ))}
      </div>

      <div className="bolumler-footer">
        <hr />
        <span>{t('home:bolumler.cite')}</span>
      </div>
    </section>
  );
}
