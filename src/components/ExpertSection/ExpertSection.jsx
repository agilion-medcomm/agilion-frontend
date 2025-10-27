import React from "react";
import "./ExpertSection.css";

export default function ExpertSection() {
  return (
    <section className="expert-section">
      <div className="expert-container">
        {/* SOL: Görsel */}
        <div className="expert-image">
          <img src="/uzman.png" alt="Uzman hekim ve hasta" />
        </div>

        {/* SAĞ: İçerik */}
        <div className="expert-content">
          <h2>Uzman Hekimlerimizle Hizmetinizdeyiz!</h2>
          <p>
            Uzman kadromuzla, yasal mevzuatlara uygun biçimde; modern tıbbın son
            gelişmeleri doğrultusunda yenilikçi ve çağdaş bir anlayışla, hasta
            ve yakınlarının güvenini kazanan, etik değerlerden ödün vermeden
            kaliteli ve ekonomik koşullarda koruyucu ve iyileştirici sağlık
            hizmetleri sunmayı hedefliyoruz.
          </p>

          <div className="expert-actions">
            {/* Hasta Çağrı Merkezi Kartı */}
            <div className="call-box">
              <h4>Hasta Çağrı Merkezi</h4>
              <p className="subtitle">İhtiyacınız olan her an yanınızdayız</p>
              <p className="phone">📞 (0212) 665 70 10</p>
            </div>

            {/* Sağ Butonlar */}
            <div className="expert-buttons">
              <button className="outline-btn">🛈 Detaylı inceleyin</button>
              <button className="outline-btn">📍 Adresimiz</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
