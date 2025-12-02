import React, { useState } from 'react';
import './EvdeSaglikPage.css'; // Stil dosyamızı import ediyoruz

// Kartlar için kullanılacak ikon bileşenleri
const HandIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M19.5 13.5c-1.2 0-2.5.3-3.5.8-1.7.8-3.3 1.9-4.5 3.3-1-.9-2.2-1.6-3.5-1.9-1.3-.3-2.6-.2-3.8.3v-5c0-.8.7-1.5 1.5-1.5H12V3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V11h3.5c.8 0 1.5.7 1.5 1.5v1z" /></svg>;
const SerumIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M16 4h-2V2h-4v2H8c-1.1 0-2 .9-2 2v11c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V6c0-1.1-.9-2-2-2zm-2 13h-4v-2h4v2zm0-4h-4V8h4v5z" /></svg>;
const LabIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-4H9v4H7V9h2v4h2V9h2v8z" /></svg>;
const BandageIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M20.5 8.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zM3.5 11.5c.8 0 1.5-.7 1.5-1.5S4.3 8.5 3.5 8.5 2 9.2 2 10s.7 1.5 1.5 1.5zm7.5 4.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-4-4c.8 0 1.5-.7 1.5-1.5S7.8 8.5 7 8.5 5.5 9.2 5.5 10s.7 1.5 1.5 1.5zm8 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z" /></svg>;

// Hizmet kartları için veri
const serviceCards = [
  { 
    icon: <HandIcon />, 
    title: "Evde Hemşirelik Hizmetleri",
    description: "Profesyonel hemşirelerimiz tarafından evinizde enjeksiyon, pansuman, serum takma ve tüm hemşirelik hizmetleri sunulmaktadır.",
    services: ["Enjeksiyon Uygulaması", "Pansuman", "Serum Takma", "Kan Basıncı Takibi", "İlaç Düzenleme", "Yara Bakımı"]
  },
  { 
    icon: <SerumIcon />, 
    title: "Evde Serum Hizmetleri",
    description: "Hastane ortamına gerek kalmadan, evinizin konforunda güvenli ve hijyenik serum hizmeti alabilirsiniz.",
    services: ["İV Serum Uygulaması", "Vitamin Serum", "Antibiyotik Serum", "Serum Takip ve Kontrol", "Acil Serum Desteği"]
  },
  { 
    icon: <LabIcon />, 
    title: "Evde Laboratuvar Hizmetleri",
    description: "Evde kan alma, idrar tahlili ve diğer laboratuvar testleriniz için randevu alın.",
    services: ["Evde Kan Alma", "Rutin Tahliller", "Check-Up Paketleri", "Covid-19 Testi", "Hormon Testleri", "Vitamin Analizleri"]
  },
  { 
    icon: <BandageIcon />, 
    title: "Evde Yara Bakımı Hizmetleri",
    description: "Ameliyat sonrası, kronik yaralar ve yanık tedavisi için uzman yara bakım hizmetleri.",
    services: ["Ameliyat Sonrası Bakım", "Bası Yarası Tedavisi", "Diyabetik Yara Bakımı", "Yanık Tedavisi", "Dikiş Alma/Atma", "Peg Bakımı"]
  },
];

// Kapsamdaki hizmetler için veri
const includedServices = [
  "Evde Pet Ve Antikor Testi", "Evde Doktor Hizmeti", "Enjeksiyon", "Pansuman", "Serum Takma", "Evde Kan Alma",
  "Küçük Cerrahi Müdahale", "Tırnak Çekimi", "Kulak Delme", "Nazır Tedavisi", "Trakeostomi Değişimi Ve Bakımı", "Kolostomi / Stoma Bakımı",
  "Nebülizatör Uygulamaları", "Sütur (Dikiş) Atma / Alma", "Delik Tırnak Tedavisi", "Nazogastrik Sonda Uygulaması", "Yaşlı Bakımı", "Anne - Bebek Bakımı",
  "Lavman Uygulama Ve Takibi", "İdrar Sondası Takma", "İdrar Sondası Çıkarma", "Peg Bakımı Ve Pansumanı", "Yara Ve Yanık Tedavisi", "Laboratuvar Tahlilleri",
  "Tansiyon Ve Nabız Takibi", "Kan Şekeri Takibi", "Evde Check-Up"
];

export default function EvdeSaglikPage() {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="evde-saglik-page">
      {/* Üst Banner */}
      <div className="page-banner">
        <img src="/evde-saglik-banner.jpg" alt="Evde bakım hizmeti alan yaşlı hasta" className="page-banner-img" />
        <div className="page-banner-overlay">
          <h1 className="page-banner-title">Evde Sağlık</h1>
        </div>
      </div>

      {/* Hizmet Kartları Bölümü */}
      <div className="page-section bg-light">
        <div className="container">
          <div className="service-card-grid">
            {serviceCards.map((card, index) => (
              <div className="service-card" key={index}>
                <div className="service-card-icon">{card.icon}</div>
                <h3 className="service-card-title">{card.title}</h3>
                <button 
                  className="service-card-button"
                  onClick={() => handleServiceClick(card)}
                >
                  İncele
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İçerik Bölümleri */}
      <div className="page-section">
        <div className="container content-container">
          {/* Evde Sağlık Nedir */}
          <section className="content-section">
            <h2>Evde Sağlık Nedir</h2>
            <img src="/evde-saglik-1.jpg" alt="Hemşire maskeli yaşlı hastayla ilgileniyor" className="content-image" />
            <p>
              Evde Bakım ve Sağlık Hizmetleri ile tedavisini evde sürdürmek isteyen hastalar, doğum öncesi ve sonrası destek talep eden anneler, yaşlı ve bakıma ihtiyacı olan, hareket kabiliyeti kısıtlanmış ve benzeri durumdaki kişiler için sunulan hizmetler ile kaliteli bir yaşam hizmeti sunulmaktadır.
            </p>
            <p>
              Zeytinburnu Tıp Merkezi olarak değerlerine ve uluslararası standartlara uygun olarak sunduğu evde bakım hizmetlerinde, konforlu, sağlıklı ve hijyenik bir ortamın sağlanması hedeflenmektedir. Evde sağlık ve bakım hizmetlerinde hastanın bulunduğu ortamda ve günlük yaşam akışı bozulmadan, en yüksek konforda hizmet sunulmaktadır. Doktor muayenesinden, kısa veya uzun süreli hemşirelik hizmetlerine, tıbbi cihaz kullanımından, laboratuvar tetkiklerine kadar uzanan geniş bir yelpazeyi içerir.
            </p>
          </section>

          {/* Evde Sağlık Hizmeti Neleri Kapsar */}
          <section className="content-section">
            <h2>Evde Sağlık Hizmeti Neleri Kapsar?</h2>
            <img src="/evde-saglik-2.jpg" alt="Hemşire bastonlu yaşlı hastaya yardım ediyor" className="content-image" />
            <p>
              Evde Sağlık Hizmeti neleri kapsar konusu en çok merak edilen konular arasındadır. Geniş bir hizmet yelpazesi altında Evde Bakım konusunda uzman kişiler, evde doktor, evde hemşire, evde anne-bebek bakımı, evde yaşlı ve evde özel bakım hizmetlerinden yararlanabilirsiniz. Evde bakım sağlık hizmetleri şu şekilde sıralanabilir:
            </p>
            <div className="pills-grid">
              {includedServices.map((service, index) => (
                <div className="pill" key={index}>{service}</div>
              ))}
            </div>
          </section>

          {/* Evde Doktor Hizmeti */}
          <section className="content-section">
            <h2>Evde Doktor Hizmeti</h2>
            <img src="/evde-saglik-3.jpg" alt="Doktor evde yaşlı hastayı stetoskop ile muayene ediyor" className="content-image" />
            <p>
              Zeytinburnu Tıp Merkezi olarak, rutin sağlık muayenesi, hastalık takibi, teşhis ve tedavi gibi birçok hizmeti kapsayan Evde Doktor Hizmeti sunuyoruz. Deneyimli ve uzman hekim kadromuz, hastalarımızı evlerinin konforunda ziyaret ederek kişiye özel bir sağlık hizmeti sunar.
            </p>
            <p>
              Siz ya da sevdikleriniz için uygun bir gün ve saatte randevu oluşturarak, hastaneye gitme zahmetine katlanmadan kaliteli sağlık hizmetine ulaşabilirsiniz. Bu hizmet, özellikle yatağa bağımlı, kronik hastalığı olan veya hareket kabiliyeti kısıtlı bireyler için idealdir.
            </p>
          </section>
        </div>
      </div>

      {/* Hizmet Detay Modalı */}
      {selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">{selectedService.icon}</div>
              <h2>{selectedService.title}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-description">{selectedService.description}</p>
              <h3>Sunulan Hizmetler</h3>
              <ul className="service-list">
                {selectedService.services.map((service, index) => (
                  <li key={index}>
                    <span className="checkmark">✓</span> {service}
                  </li>
                ))}
              </ul>
              <div className="modal-actions">
                <button className="btn-primary" onClick={closeModal}>
                  📞 Randevu Al
                </button>
                <button className="btn-secondary" onClick={closeModal}>
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}