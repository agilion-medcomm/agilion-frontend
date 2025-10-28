import React, { useState } from "react";
import "./FAQ.css";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "01. Kurumunuza başvurmadan önce randevu almak gerekiyor mu?",
      answer:
        "Acil servis dışındaki tüm polikliniklerimiz randevu sistemi ile hizmet vermektedir.",
    },
    {
      question: "02. Nasıl Randevu Alınır?",
      answer:
        "Tüm bölümlerimizden randevu almak için sitemiz üzerinden çevrimiçi randevu sistemimizi kullanabilir veya çağrı merkezimizi arayarak kolayca randevu alabilirsiniz.",
    },
    {
      question: "03. Kurumunuzda hangi laboratuvar testleri yapılabilir?",
      answer:
        "Modern laboratuvarımızda kan testleri, idrar testleri, biyokimyasal testler gibi geniş bir yelpazede testler yapılabilmektedir. Ayrıca, görüntüleme hizmetleri arasında röntgen ve ultrason da bulunmaktadır.",
    },
    {
      question:
        "04. Muayene olduktan sonra, doktorun istediği tetkiklerin sonuçlarını göstermek ya da kontrole gelmek için tekrar randevu almaya gerek var mı?",
      answer:
        "Bu konudaki uygulamamız polikliniklerimizin yoğunluğuna göre değişmektedir. Bu nedenle, eğer doktorunuz tetkik istemiş veya kontrole çağırmış ise muayeneden çıktığınızda sonuçlarınızı göstermek veya kontrole gelmek için randevu almanız gerekip gerekmediğini poliklinik sekreterinden öğreniniz.",
    },
  ];

  return (
    <section className="faq-section">
      {/* Başlık */}
      <h2 className="faq-title">Merak Edilenler</h2>

      {/* Ana konteyner */}
      <div className="faq-container">
        {/* Sol taraf: Görsel */}
        <div className="faq-image">
          <img src="/erkekdoktor.png" alt="Erkek Doktor" />
        </div>

        {/* Sağ taraf: Akordiyon */}
        <div className="faq-accordion">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "open" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
