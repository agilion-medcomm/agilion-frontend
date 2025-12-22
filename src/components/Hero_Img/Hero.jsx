import React from "react";
import { useTranslation } from "react-i18next";
import "./Hero.css";

export default function Hero() {
  const { t } = useTranslation(['home']);
  return (
    <section className="hero">
      <div className="hero__image">
        <picture>
          <source media="(max-width: 768px)" srcSet="/mobil-cover.png" />
          <img src="/cover.png" alt={t('home:hero.alt')} />
        </picture>
        <div className="hero__overlay"></div>
      </div>
    </section>
  );
}