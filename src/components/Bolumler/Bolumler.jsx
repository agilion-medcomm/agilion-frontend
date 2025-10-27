import React from "react";
import "./Bolumler.css";

export default function Bolumler() {
  const services = [
    { title: "Acil 7/24", img: "/acil.png", color: "red" },
    { title: "Ağız ve Diş", img: "/dis.png", color: "blue" },
    { title: "Beslenme Diyet", img: "/diyet.png", color: "blue" },
    { title: "Dermatoloji", img: "/derma.png", color: "blue" },
    { title: "Genel Cerrahi", img: "/cerrah.png", color: "blue" },
    { title: "Göz Sağlığı", img: "/goz.png", color: "blue" },
    { title: "İç Hastalıklar", img: "/ichastalıklar.png", color: "blue" },
    { title: "Kadın & Doğum", img: "/dogum.png", color: "blue" },
  ];

  return (
    <section className="bolumler-section">
      {/* Başlık */}
      <h2 className="bolumler-title">
        İhtiyacınız Olan Tüm Alanlarda Hizmetinizdeyiz
      </h2>

      {/* Grid Kartlar */}
      <div className="bolumler-grid">
        {services.map((item, i) => (
          <div
            key={i}
            className={`bolum-card ${item.color === "red" ? "red" : ""}`}
          >
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <button>İncele</button>
          </div>
        ))}
      </div>

      {/* Alt yazı */}
      <div className="bolumler-footer">
        <hr />
        <span>20 yılı aşkın tecrübemizle hizmetinizdeyiz</span>
      </div>
    </section>
  );
}
