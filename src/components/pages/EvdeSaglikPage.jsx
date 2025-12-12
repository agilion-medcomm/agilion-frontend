import React, { useState } from 'react';
import './EvdeSaglikPage.css'; // Stil dosyamızı import ediyoruz


// Hizmet kartları için veri
// Hizmet kartları için veri
const serviceCards = [
  {
    // Public klasöründeki dosyaya direkt yol veriyoruz (Başına / koyarak)
    icon: <img src="/nurse1.svg" alt="Hemşirelik" className="custom-svg-icon" />,
    title: "Evde Hemşirelik Hizmetleri",
    description: "Profesyonel hemşirelerimiz tarafından evinizde enjeksiyon, pansuman, serum takma ve tüm hemşirelik hizmetleri sunulmaktadır.",
    services: ["Enjeksiyon Uygulaması", "Pansuman", "Serum Takma", "Kan Basıncı Takibi", "İlaç Düzenleme", "Yara Bakımı"]
  },
  {
    icon: <img src="/serum2.svg" alt="Serum" className="custom-svg-icon" />,
    title: "Evde Serum Hizmetleri",
    description: "Hastane ortamına gerek kalmadan, evinizin konforunda güvenli ve hijyenik serum hizmeti alabilirsiniz.",
    services: ["İV Serum Uygulaması", "Vitamin Serum", "Antibiyotik Serum", "Serum Takip ve Kontrol", "Acil Serum Desteği"]
  },
  {
    icon: <img src="/lab3.svg" alt="Laboratuvar" className="custom-svg-icon" />,
    title: "Evde Laboratuvar Hizmetleri",
    description: "Evde kan alma, idrar tahlili ve diğer laboratuvar testleriniz için randevu alın.",
    services: ["Evde Kan Alma", "Rutin Tahliller", "Check-Up Paketleri", "Covid-19 Testi", "Hormon Testleri", "Vitamin Analizleri"]
  },
  {
    icon: <img src="/care4.svg" alt="Yara Bakımı" className="custom-svg-icon" />,
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
        <img src="/esp-banner.png" alt="Evde bakım hizmeti alan yaşlı hasta" className="page-banner-img" />
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
                <p className="service-card-desc">{card.description}</p>
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
              <button className="modal-close" onClick={closeModal}>
                <img src="/x.svg" alt="Kapat" />
              </button>            </div>

            <div className="modal-body">
              {/* İçeriği yan yana almak için yeni bir kapsayıcı açtık */}
              <div className="modal-row">

                {/* SOL Taraf: Açıklama */}
                <div className="modal-col-left">
                  <h3 className="modal-subtitle">Hizmet Detayı</h3>
                  <p className="modal-description">{selectedService.description}</p>
                </div>

                {/* SAĞ Taraf: Liste */}
                <div className="modal-col-right">
                  <h3 className="modal-subtitle">Sunulan Hizmetler</h3>
                  <ul className="service-list">
                    {selectedService.services.map((service, index) => (
                      <li key={index}>
                        <span className="checkmark">✓</span> {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Alt Kısım: Sadece Randevu Butonu */}
              <div className="modal-actions">
                <button className="btn-primary" onClick={closeModal}>
                  Randevu Al
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}