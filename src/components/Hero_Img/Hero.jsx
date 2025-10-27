import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
     <section className="hero">
            <div className="hero__image">
              <img src="/cover.png" alt="AgilionMED Hero Görseli" />
              <div className="hero__overlay"></div>
            </div>

            <div className="hero__searchbox">
              <div className="search">
                <input
                  className="search__input"
                  type="text"
                  placeholder="Size nasıl yardımcı olabiliriz?"
                  aria-label="Soru veya hizmet arayın"
                />
                <button className="search__btn" aria-label="Ara">
                  <SearchIcon />
                </button>
              </div>
            </div>
          </section>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}