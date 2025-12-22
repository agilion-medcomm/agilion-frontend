import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FAQ.css";

export default function FAQ() {
  const { t } = useTranslation(['home']);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = t('home:faq.items', { returnObjects: true });

  return (
    <section className="faq-section">
      {/* Başlık */}
      <h2 className="faq-title">{t('home:faq.title')}</h2>

      {/* Ana konteyner */}
      <div className="faq-container">
        {/* Sol taraf: Görsel */}
        <div className="faq-image">
          <img src="/kdoctor.png" alt="Kadın Doktor" />
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
