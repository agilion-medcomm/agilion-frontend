import React from "react";
import { useNavigate } from "react-router-dom";
import "./Bolumler.css";

export default function Bolumler() {
  const navigate = useNavigate();

  const services = [
    { id: "acil", title: "Acil 7/24", img: "/b11.png", color: "red" },
    { id: "dis", title: "Ağız ve Diş", img: "/b22.png", color: "blue" },
    { id: "diyet", title: "Beslenme Diyet", img: "/b3diyet.png", color: "blue" },
    { id: "derma", title: "Dermatoloji", img: "/b44.png", color: "blue" },
    { id: "cerrahi", title: "Genel Cerrahi", img: "/b55.png", color: "blue" },
    { id: "goz", title: "Göz Sağlığı", img: "/b6goz.png", color: "blue" },
    { id: "dahiliye", title: "İç Hastalıklar", img: "/b77.png", color: "blue" },
    { id: "kadin", title: "Kadın & Doğum", img: "/b88.png", color: "blue" },
  ];

  const handleNavigate = (id) => {
    navigate("/bolumlerimiz", { state: { selectedId: id } });
    window.scrollTo(0, 0);
  };

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
            onClick={() => handleNavigate(item.id)}
            style={{ cursor: "pointer" }}
          >
            <img src={item.img} alt={item.title} />
            <h3>{item.title}</h3>
            <button onClick={(e) => {
              e.stopPropagation();
              handleNavigate(item.id);
            }}>İncele</button>
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
