import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__image">
        <picture>
          <source media="(max-width: 768px)" srcSet="/mobil-cover.png" />
          <img src="/cover.png" alt="AgilionMED Hero Görseli" />
        </picture>
        <div className="hero__overlay"></div>
      </div>
    </section>
  );
}