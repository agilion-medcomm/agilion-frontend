import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EvdeSaglikPage.css'; // Stil dosyamızı import ediyoruz

const API_BASE = 'http://localhost:5001/api/v1';

// Kartlar için kullanılacak ikon bileşenleri
const HandIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M19.5 13.5c-1.2 0-2.5.3-3.5.8-1.7.8-3.3 1.9-4.5 3.3-1-.9-2.2-1.6-3.5-1.9-1.3-.3-2.6-.2-3.8.3v-5c0-.8.7-1.5 1.5-1.5H12V3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V11h3.5c.8 0 1.5.7 1.5 1.5v1z" /></svg>;
const SerumIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M16 4h-2V2h-4v2H8c-1.1 0-2 .9-2 2v11c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4V6c0-1.1-.9-2-2-2zm-2 13h-4v-2h4v2zm0-4h-4V8h4v5z" /></svg>;
const LabIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 14h-2v-4H9v4H7V9h2v4h2V9h2v8z" /></svg>;
const BandageIcon = () => <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor"><path d="M20.5 8.5c-.8 0-1.5.7-1.5 1.5s.7 1.5 1.5 1.5 1.5-.7 1.5-1.5-.7-1.5-1.5-1.5zM3.5 11.5c.8 0 1.5-.7 1.5-1.5S4.3 8.5 3.5 8.5 2 9.2 2 10s.7 1.5 1.5 1.5zm7.5 4.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm-4-4c.8 0 1.5-.7 1.5-1.5S7.8 8.5 7 8.5 5.5 9.2 5.5 10s.7 1.5 1.5 1.5zm8 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z" /></svg>;

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
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    tckn: '',
    phoneNumber: '',
    email: '',
    address: '',
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const openRequestForm = (serviceTitle = '') => {
    // Kullanıcı giriş yapmamışsa, giriş uyarısını göster
    if (!user || !token) {
      setShowLoginPrompt(true);
      setSelectedService(null);
      return;
    }
    
    // Giriş yapmışsa form verilerini kullanıcı bilgileriyle doldur
    const fullName = user.fullName || 
                     (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
                     user.name || '';
    
    setFormData(prev => ({ 
      ...prev, 
      serviceType: serviceTitle,
      fullName: fullName,
      tckn: user.tckn || '',
      phoneNumber: user.phoneNumber || user.phone || '',
      email: user.email || ''
    }));
    setSelectedService(null);
    setShowRequestForm(true);
    setSubmitResult(null);
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
    setFormData({
      fullName: '',
      tckn: '',
      phoneNumber: '',
      email: '',
      address: '',
      serviceType: '',
      preferredDate: '',
      preferredTime: '',
      notes: ''
    });
    setSubmitResult(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch(`${API_BASE}/home-health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: 'Talebiniz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.' });
        // Form'u temizle
        setFormData({
          fullName: '',
          tckn: '',
          phoneNumber: '',
          email: '',
          address: '',
          serviceType: '',
          preferredDate: '',
          preferredTime: '',
          notes: ''
        });
      } else {
        setSubmitResult({ success: false, message: data.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitResult({ success: false, message: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.' });
    } finally {
      setIsSubmitting(false);
    }
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
                <button className="btn-primary" onClick={() => openRequestForm(selectedService.title)}>
                  Randevu Al
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Randevu Talep Formu Modalı */}
      {showRequestForm && (
        <div className="modal-overlay" onClick={closeRequestForm}>
          <div className="modal-content request-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Evde Sağlık Hizmeti Talebi</h2>
              <button className="modal-close" onClick={closeRequestForm}>
                <img src="/x.svg" alt="Kapat" />
              </button>
            </div>

            <div className="modal-body">
              {submitResult && (
                <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
                  {submitResult.message}
                </div>
              )}

              {!submitResult?.success && (
                <form onSubmit={handleSubmit} className="request-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName">Ad Soyad *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="tckn">T.C. Kimlik No *</label>
                      <input
                        type="text"
                        id="tckn"
                        name="tckn"
                        value={formData.tckn}
                        onChange={handleInputChange}
                        required
                        placeholder="11 haneli TC kimlik numaranız"
                        maxLength={11}
                        pattern="[0-9]{11}"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Telefon Numarası *</label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">E-posta</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="address">Adres *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Hizmet alacağınız adres"
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="serviceType">Hizmet Türü *</label>
                    <select
                      id="serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Hizmet seçiniz</option>
                      {serviceCards.map((card, index) => (
                        <option key={index} value={card.title}>{card.title}</option>
                      ))}
                      <option value="Evde Doktor Hizmeti">Evde Doktor Hizmeti</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferredDate">Tercih Edilen Tarih</label>
                      <input
                        type="date"
                        id="preferredDate"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="preferredTime">Tercih Edilen Saat</label>
                      <select
                        id="preferredTime"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                      >
                        <option value="">Saat seçiniz</option>
                        <option value="09:00-12:00">09:00 - 12:00</option>
                        <option value="12:00-15:00">12:00 - 15:00</option>
                        <option value="15:00-18:00">15:00 - 18:00</option>
                        <option value="18:00-21:00">18:00 - 21:00</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="notes">Ek Notlar</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Varsa ek bilgiler, özel durumlar veya sorularınız"
                      rows={3}
                    />
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={closeRequestForm}>
                      İptal
                    </button>
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Gönderiliyor...' : 'Talep Gönder'}
                    </button>
                  </div>
                </form>
              )}

              {submitResult?.success && (
                <div className="form-actions">
                  <button className="btn-primary" onClick={closeRequestForm}>
                    Tamam
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Giriş Uyarı Modalı */}
      {showLoginPrompt && (
        <div className="modal-overlay" onClick={closeLoginPrompt}>
          <div className="modal-content login-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Giriş Yapmanız Gerekiyor</h2>
              <button className="modal-close" onClick={closeLoginPrompt}>
                <img src="/x.svg" alt="Kapat" />
              </button>
            </div>
            <div className="modal-body">
              <div className="login-prompt-content">
                <div className="login-prompt-icon">
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <p className="login-prompt-message">
                  Evde sağlık hizmeti talebinde bulunabilmek için önce giriş yapmanız gerekmektedir.
                </p>
                <p className="login-prompt-submessage">
                  Hesabınız yoksa kayıt olabilirsiniz.
                </p>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeLoginPrompt}>
                  İptal
                </button>
                <button type="button" className="btn-primary" onClick={goToLogin}>
                  Giriş Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}