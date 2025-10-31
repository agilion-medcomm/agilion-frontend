import React, { useState } from "react";
import "./Doctors.css";
// react-transition-group import'larına artık gerek yok.

export default function Doctors() {
  const [currentPage, setCurrentPage] = useState(0);
  // 1. Sadece animasyon yönünü tutacak bir state ekliyoruz.
  const [direction, setDirection] = useState("next");

  const doctors = [
    { name: "Dr. Andrew Collins", field: "Acil Servis", img: "/doktor1.png" },
    { name: "Dr. Michael Thompson", field: "Acil Servis", img: "/doktor2.png" },
    { name: "Dr. Sophia Ramirez", field: "Göz Sağlığı", img: "/doktor3.png" },
    { name: "Dr. Olivia Novak", field: "Dermatoloji", img: "/doktor4.png" },
    { name: "Dr. Emma Johansson", field: "Kadın & Doğum", img: "/doktor5.png" },
    { name: "Dr. Luca Moretti", field: "Göz Sağlığı", img: "/doktor6.png" },
    { name: "Dr. Daniel Chen", field: "Genel Cerrahi", img: "/doktor7.png" },
    { name: "Dr. Emily Carter", field: "Ağız ve Diş Sağlığı", img: "/doktor8.png" },
    { name: "Dr. Ethan Müller", field: "Ağız ve Diş Sağlığı", img: "/doktor9.png" },
    { name: "Dr. Noah Becker", field: "Beslenme & Diyet", img: "/doktor10.png" },
    { name: "Dr. Anna Petrova", field: "Beslenme & Diyet", img: "/doktor11.png" },
    { name: "Dr. Lucas Bernard", field: "Başhekim", img: "/doktor12.png" },
  ];

  const doctorsPerPage = 4;
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  // 2. Handler'ları yönü set edecek şekilde güncelliyoruz.
  const handlePrev = () => {
    setDirection("prev");
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection("next");
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const start = currentPage * doctorsPerPage;
  const visibleDoctors = doctors.slice(start, start + doctorsPerPage);

  return (
    <section className="doctors-section">
      {/* Başlık Bloğu */}
      <div className="doctors-header">
        <h2>Alanında Uzman Hekimlerimiz</h2>
      </div>

      {/* 3. Sihir burada:
           - 'key={currentPage}': React'e "bu sayfa değiştiğinde, eski
             component'i at ve bunu SIFIRDAN çiz" der.
           - className: SIFIRDAN çizerken, animasyon sınıfımızı ekleriz.
      */}
      <div
        className={`doctors-container ${direction === "next" ? "slide-in-next" : "slide-in-prev"
          }`}
        key={currentPage} 
      >
        {visibleDoctors.map((doc, i) => (
          <div className="doctor-card" key={i} onClick={() => console.log(`Clicked ${doc.name}`)}>
            <img src={doc.img} alt={doc.name} />
            <h3>{doc.name}</h3>
            <p>{doc.field}</p>
          </div>
        ))}
      </div>

      {/* Navigasyon Butonları */}
      <div className="doctors-navigation">
        <button onClick={handlePrev} aria-label="Önceki">
          <img src="/back.png" alt="Önceki" className="nav-icon" />
        </button>
        <button onClick={handleNext} aria-label="Sonraki">
          <img src="/next.png" alt="Sonraki" className="nav-icon" />
        </button>
      </div>

    </section>
  );
}