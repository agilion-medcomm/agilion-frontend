import React from 'react';
import './KurumsalPage.css';
import Stats from '../Stats/Stats';

const KurumsalPage = () => {
  return (
    <div className="kurumsal-page">
      {/* Hero Section */}
      <section className="kurumsal-hero">
        <div className="kurumsal-hero__content">
          <img src="/agilion1.svg" alt="AgilionMED Logo" className="kurumsal-hero__logo" />
          <h1 className="kurumsal-hero__title">AgilonMED</h1>
        </div>
      </section>

      {/* Content Container */}
      <div className="kurumsal-content">
        {/* Intro Text */}
        <div className="kurumsal-intro">
          <p>
            23 yıllık tecrübemizi, 2024 yılında hayata geçirdiğimiz yeni Tıp Merkezi
            projemizle taçlandırdık. 2500 m² genişliğindeki yeni binamızda, modern tıbbi
            donanımımız ve uzman hekimlerimizle 7/24 yanınızdayız.
          </p>
          <p>
            Çağdaş tıbbın gerekliliklerini, yasal standartlara uygun ve etik ilkelerden taviz
            vermeden yerine getiriyoruz. Uzman ekibimizle, sadece hastalarımızın değil
            çalışanlarımızın da güven duyduğu bir yapı inşa ettik. Kaliteli ve ulaşılabilir
            sağlık hizmeti sunarken, toplumu bilgilendirmeyi ve koruyucu hekimliği
            yaygınlaştırmayı temel görevimiz kabul ediyoruz.
          </p>
        </div>

        {/* DEĞERLERİMİZ */}
        <section>
          <h2 className="kurumsal-section-header">DEĞERLERİMİZ</h2>
          <div className="kurumsal-text-block">
            <ul>
              <li><strong>İnsana Saygı:</strong> Hasta ve çalışan haklarına tam bağlılık.</li>
              <li><strong>Mutluluk Odaklı:</strong> Koşulsuz hasta ve çalışan memnuniyeti.</li>
              <li><strong>Bilimsel Yaklaşım:</strong> Mesleki sorumluluk ve etik değerler.</li>
              <li><strong>7/24 Erişim:</strong> Kesintisiz ve ulaşılabilir sağlık hizmeti.</li>
              <li><strong>Açık İletişim:</strong> Yönetimde ve hizmette tam şeffaflık.</li>
              <li><strong>Güncel Tedavi:</strong> Kanıta dayalı, modern tıbbi hizmet.</li>
            </ul>
          </div>
        </section>

        {/* MİSYONUMUZ */}
        <section>
          <h2 className="kurumsal-section-header">MİSYONUMUZ</h2>
          <div className="kurumsal-text-block">
            <p>
              Sektördeki tüm gelişmeleri yakından takip ederek, etik ilkeler ışığında sağlık
              hizmetlerini topluma ulaştırmayı ilke ediniyoruz. 'Sürekli yenilenme' felsefemizle;
              evrensel, bilimsel ve teknolojik yenilikleri uygulamalarımıza entegre ederek
              yüksek kalitede hizmet sunmayı; hasta, hasta yakını ve çalışan memnuniyetini her
              zaman en üst düzeyde tutmayı hedefliyoruz.
            </p>
          </div>
        </section>

        {/* VİZYONUMUZ */}
        <section>
          <h2 className="kurumsal-section-header">VİZYONUMUZ</h2>
          <div className="kurumsal-text-block">
            <p>
              Mükemmeliyet ilkemiz; yasal düzenlemelere tam uyum çerçevesinde, uzman
              kadromuzla modern tıbbın ışığında koruyucu, tedavi edici ve bütüncül sağlık
              hizmetleri sunmaktır. Yenilikçi ve çağdaş yapımızla; hasta, hasta yakını ve
              çalışanlarımızın güvenliğini ve memnuniyetini esas alarak bu standartları
              sürdürülebilir kılmayı taahhüt ediyoruz
            </p>
          </div>
        </section>
      </div>

      {/* Stats Component */}
      <Stats />
    </div>
  );
};

export default KurumsalPage;
