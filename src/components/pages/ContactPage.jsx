import React, { useState } from 'react';
import './ContactPage.css'; // Stil dosyamızı import ediyoruz


const PhoneIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const LocationIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      alert('Lütfen aydınlatma metnini onaylayın.');
      return;
    }
    console.log('Form verisi gönderildi:', formData);
    // Burada form verisini backend'e gönderecek API çağrısı yapılabilir.

    
    alert('Mesajınız başarıyla gönderildi!');
  };

  return (
    <div className="contact-page">
      {/* Üst Banner */}
      <div className="contact-banner">
        <img src="/contact-banner.jpg" alt="İletişim Merkezi" className="contact-banner-img" />
        <div className="contact-banner-overlay">
          <h1>İletişim</h1>
        </div>
      </div>

      <div className="container page-section">
        {/* Başlık ve Açıklama */}
        <div className="contact-header">
          <h1 className="contact-title">İLETİŞİME GEÇELİM</h1>
          <p className="contact-subtitle">
            Sağlık hizmetlerimiz hakkında bilgi almak veya randevu oluşturmak için aşağıdaki iletişim bilgilerimizi kullanabilirsiniz.
          </p>
        </div>

        {/* İletişim Bilgileri */}
        <div className="contact-info-grid">
          <div className="contact-info-item">
            <PhoneIcon />
            <span>+90 (212) 000 00 00</span>
          </div>
          <div className="contact-info-item">
            <MailIcon />
            <span>info@agiliontipmerkezi.com.tr</span>
          </div>
          <div className="contact-info-item">
            <PhoneIcon />
            <span>+90 (212) 000 00 00</span>
          </div>
          <div className="contact-info-item">
            <LocationIcon />
            <span>Cumhuriyet, 2254. Sk. No:2, 41420 Gebze/Kocaeli</span>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="contact-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder="İsim" value={formData.name} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-row">
              <input type="email" name="email" placeholder="Mail" value={formData.email} onChange={handleChange} required />
              <input type="text" name="subject" placeholder="Konu" value={formData.subject} onChange={handleChange} />
            </div>
            <textarea name="message" placeholder="Mesajınız..." rows="6" value={formData.message} onChange={handleChange} required></textarea>
            <div className="form-agreement">
              <input type="checkbox" id="agreed" name="agreed" checked={formData.agreed} onChange={handleChange} />
              <label htmlFor="agreed">
                Kişisel verilerimin aydınlatma metni kapsamında işlenmesini kabul ediyorum.
              </label>
            </div>
            <button type="submit" className="form-submit-btn">Hemen Gönder</button>
          </form>
        </div>
      </div>
      
      {/* Harita */}
      <div className="contact-map">
        <iframe

src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1759.6603115191679!2d29.356883807666723!3d40.80714894885567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cade5b10c31be7%3A0xba23b0e884a7e655!2sGebze%20Technical%20University%20Computer%20Engineering!5e0!3m2!1str!2str!4v1763457692285!5m2!1str!2str"

        
           width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Konumumuz"
        ></iframe>
      </div>
    </div>
  );
}
