import React from "react";
import { useTranslation } from "react-i18next";
import "./Hero.css";

export default function Hero() {
  const { t, i18n } = useTranslation(['home']);
  const isEn = i18n.language?.startsWith('en');

  return (
    <section className="hero">
      <div className="hero__image">
        <picture key={i18n.language}>
          <source media="(max-width: 768px)" srcSet={isEn ? "/mobil-cover-en.jpeg" : "/mobil-cover.png"} />
          <img src={isEn ? "/cover-en.png" : "/cover.png"} alt={t('home:hero.alt')} />
        </picture>
        <div className="hero__overlay"></div>
      </div>
    </section>
  );
}