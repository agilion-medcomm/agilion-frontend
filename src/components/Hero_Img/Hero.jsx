import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__image">
        <img src="/cover.png" alt="AgilionMED Hero Görseli" />
        <div className="hero__overlay"></div>
      </div>
    </section>
  );
}