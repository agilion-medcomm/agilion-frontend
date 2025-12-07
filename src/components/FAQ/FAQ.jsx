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
    {
      question: "05. SGK veya özel sağlık sigortaları ile anlaşmanız var mı?",
      answer:
        "Evet, kurumumuzun SGK (Sosyal Güvenlik Kurumu) ile anlaşması bulunmaktadır. Ayrıca birçok özel sağlık sigortası ve tamamlayıcı sağlık sigortası ile de anlaşmamız mevcuttur. Detaylı bilgi için danışma birimimizle iletişime geçebilirsiniz.",
    },
    {
      question: "06. Refakatçi ve ziyaretçi kurallarınız nelerdir?",
      answer:
        "Hastalarımızın sağlığı ve konforu için ziyaret saatlerimiz her gün 10:00 - 22:00 arasındadır. Her hasta için bir refakatçi kabul edilmekte olup, yoğun bakım ünitelerimizde ziyaret kuralları hastanın durumuna göre doktor onayı ile belirlenmektedir.",
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
