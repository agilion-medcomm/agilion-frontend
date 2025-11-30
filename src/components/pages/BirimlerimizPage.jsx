import React, { useState } from 'react';
import './BirimlerimizPage.css';

const BirimlerimizPage = () => {
  const [selectedId, setSelectedId] = useState('anestezi');

  const units = [
    {
      id: 'anestezi',
      title: 'Anestezi & Reanimasyon',
      icon: '/anestezi.svg', // Placeholder
      contentTitle: 'Anestezi ve Reanimasyon',
      content: <p>Anestezi ve reanimasyon, cerrahi veya diğer tıbbi müdahaleler sırasında hastanın bilincini kaybetmesini sağlamak ve hayati fonksiyonlarını sürdürmek için kullanılan tıbbi uygulamalardır.
        Anestezi, hastanın ağrı duymasını önlemek, vücut fonksiyonlarını kontrol etmek ve cerrahi işlem sırasında rahatlık sağlamak amacıyla kullanılır.

        Reanimasyon ise kalp durması veya solunum durması gibi acil durumlarda hayat kurtarmak için yapılan tıbbi müdahalelerdir. Hızlı ve etkili reanimasyon, hastanın hayatta kalma şansını artırabilir. Anestezi ve reanimasyon, tıbbi ekipler tarafından dikkatle uygulanmalı ve sürekli bir gözetim altında gerçekleştirilmelidir.</p>
    },
    {
      id: 'ameliyathane',
      title: 'Ameliyathane',
      icon: '/ameliyathane.svg',
      contentTitle: 'Ameliyathane',
      content: <p>Ameliyathane, tıbbi müdahalelerin gerçekleştirildiği özel bir bölümdür. Burada pek çok farklı işlem yapılmaktadır ve ameliyat süreci titizlikle planlanır ve uygulanır. Ameliyathane işlevleri, hastanın sağlığını korumak ve ameliyatın başarılı bir şekilde gerçekleşmesini sağlamak için çeşitli aşamalardan oluşur.

        Ameliyathane işlevlerinin ilk adımı, hastanın ameliyat öncesi hazırlıklarının yapılmasıdır. Bu aşamada, hastanın tıbbi geçmişi incelenir, gerekli tetkikler yapılır ve ameliyat için gerekli olan tüm bilgiler toplanır. Ayrıca, hastanın ameliyat öncesi beslenmesi ve ilaç kullanımı gibi faktörler de dikkate alınır.
        Ameliyat sürecinde, ameliyatın gerçekleştirileceği oda sterilize edilir ve ameliyat masası hazırlanır. Ameliyat sırasında kullanılacak olan cerrahi aletler ve ekipmanlar da özenle seçilir ve hazırlanır. Ameliyathane ekibi, ameliyatın başarılı bir şekilde gerçekleşmesi için sıkı bir iş birliği içinde çalışır.

        Ameliyatın gerçekleştirilmesi aşamasında, cerrahın talimatlarına göre hareket edilir ve gerekli olan tüm prosedürler uygulanır. Ameliyat sürecinde hastanın vital bulguları izlenir ve gerektiğinde müdahaleler yapılır. Ameliyat sonrası ise hastanın iyileşme süreci takip edilir ve gerekli olan tüm destek sağlanır.

        Ameliyathane işlevleri, hastanın sağlığını korumak ve ameliyatın başarılı bir şekilde gerçekleşmesini sağlamak için büyük bir öneme sahiptir. Bu nedenle, ameliyathane ekibi, deneyimli ve uzman bir şekilde çalışmalı ve her aşamada titizlikle hareket etmelidir.</p>
    },
    {
      id: 'dogumhane',
      title: 'Doğumhane',
      icon: '/dogum.svg',
      contentTitle: 'Doğumhane',
      content: <p>ÖHastaneye başvurduğunuzda öncelikle doktorunuz sizi muayene eder ve doğumun gerçekten başlayıp başlamadığını tespit eder. Doğumun başlaması ancak vajinal muayene (elle muayene) ile anlaşılır, ultrason ile anlaşılmaz.

        Vajinal muayene ile rahim ağzında açıklık var mı, su gelmesi veya kanama var mı bakılır ve buna göre doğumun başladığına karar verilirse hasta doğumhaneye yönlendirilir. Eğer doğum başlamamışsa, rahim ağzında açılma yoksa, su gelmesi yoksa, kanama yoksa ve bebeğin ultrason ve NST muayenesinde bir anormallik yoksa anne tekrar evine yönlendirilir, sancıları arttığında veya su geldiğinde tekrar hastaneye gelmesi önerilir.

        Tabii bu durumda kaç haftalık gebe olduğunuz da önemlidir, bunun da tespiti yatıştan önce yapılır. Kaç haftalık hamile olduğunuzu anlamak için ultrason yapılır ve bazen eskiden girdiğiniz ultrasonların raporları ve tahlillere de bakılır. Bu nedenle doğuma giderken bunları mutlaka yanınızda götürün.

        Bu hesaplamalara göre eğer bebeğin doğum zamanının erken olduğuna karar verilirse hasta doğumhaneye gönderilmez, sancıların durdurulması için ayrı bir servise ilaç tedavisi için gönderilir. Eğer doğum zamanı uygunsa veya erken olsa bile doğum çok ilerlemiş ve durdurulması imkansız görünüyorsa hasta doğumhaneye yönlendirilir.</p>
    },
    {
      id: 'rontgen',
      title: 'Röntgen',
      icon: '/rontgen.svg',
      contentTitle: 'Röntgen',
      content: <p>Röntgen, insan vücudunu ve diğer nesneleri görüntülemek için kullanılan bir tıbbi görüntüleme teknolojisidir. Bu teknoloji, X-ışınlarının kullanımıyla çalışır. Röntgen cihazları, vücut dokularının iç yapısını görüntülemek için kullanılır ve birçok tıbbi durumun teşhisinde önemli bir araçtır.

        Röntgen, vücutta kemikler, organlar ve diğer dokular gibi farklı yoğunluğa sahip yapıları ayırt etmek için kullanılır. Bu görüntüleme teknolojisi, tıbbi uzmanlara hastalıkları teşhis etme ve tedavi planlarını oluşturma konusunda yardımcı olur. Ayrıca, cerrahlarve diğer sağlık profesyonelleri için önemli bir rehberlik aracıdır.</p>
    },
    {
      id: 'laboratuvar',
      title: 'Laboratuvar',
      icon: '/lab.svg',
      contentTitle: 'Laboratuvar',
      content: <p>Zeytinburnu Tıp Merkezi,  hastalarına acil ve rutin laboratuvar hizmeti verirken, özellikle güvenilir sonuç üretmeyi hedef edinmiş olmanın gereklerini yerine getiren merkez laboratuvarı, haftanın 7 günü hizmetini sürdürmektedir. </p>
    },
    {
      id: 'saglik_raporlari',
      title: 'Sağlık Raporları',
      icon: '/rapor.svg',
      contentTitle: 'Sağlık Raporları',
      content: (
        <>
          <p>Kurumumuz Tarafından Verilen Sağlık Raporları</p>
          <div className="birim-tags">
            <span>Evlilik için sağlık raporu</span>
            <span>Sürücü olur sağlık raporu</span>
            <span>Spor için sağlık raporu</span>
            <span>Havuz için sağlık raporu</span>
            <span>İş için sağlık raporu</span>
            <span>Yol Belgesi (EK-7 Raporu)</span>
          </div>
        </>
      )
    },
    {
      id: 'ultrason',
      title: 'Ultrasonografi',
      icon: '/ultrason.svg',
      contentTitle: 'Ultrasonografi',
      content: <p>Ultrason (USG) ile hem iç organlar hakkında bilgi edilebilir, hem de gebelik tanı ve kontrolünde fetüsü izlemek amacıyla kullanılmaktadır. Radyasyon içermediği için düzenli olarak yaptırılmasının hiçbir sakıncası yoktur.</p>
    },
    {
      id: 'solunum',
      title: 'Solunum Testi',
      icon: '/solunum.svg',
      contentTitle: 'Solunum Testi',
      content: <p>Solunum fonksiyon testi temel anlamda akciğerlerinizin performansını ölçmek için yapılan bir testtir.

        Soluk alıp verme sırasında oluşan akım ya da volüm değişikliklerinin zamanın türevi olarak ölçülmesi esasına dayanan fizyolojik bir testtir.
        Solunum fonksiyon testinin yaygın kullanılan adlarından biri de akciğer fonksiyon testidir.

        Bu testlerle akciğerlere ne kadar hava girip çıktığı, kanınıza giden oksijen miktarı, efor sırasında akciğerlerinizin ne kadar iyi çalıştığı ölçülür.

        Solunum fonsiyon testleri arasında en yaygın kullanılanı spirometridir. Bu yöntemde soluduğunuz havanın giriş – çıkış hacmi ve hızı ölçülür. </p>
    },
    {
      id: 'odyometri',
      title: 'Odyometri ve Timpanometri',
      icon: '/odyometri.svg',
      contentTitle: 'Odyometri ve Timpanometri',
      content: <p>Odyometri, kişinin işitme yeteneğini değerlendirmek için kullanılan bir testtir. Bu testte, kişinin işitme eşiği ölçülür ve işitme kaybı tespit edilir. Odyometri testi, kulaklıklar ve sesli uyarıcılar kullanılarak gerçekleştirilir.

        Timpanometri ise, kulak zarının ve orta kulak basıncının ölçüldüğü bir testtir. Bu testte, bir prob kulak kanalına yerleştirilir ve basınç değişiklikleri kaydedilir. Timpanometri, kulak zarı problemlerini tespit etmek için kullanılır.
        Timpanometri testi sırasında, probun kulak kanalına yerleştirilmesiyle birlikte basınç değişiklikleri kaydedilir ve bu sayede kulak zarının ve orta kulak basıncının durumu değerlendirilir.

        Odyometri ve timpanometri testleri, genellikle birlikte yapılır ve birbirlerini tamamlayıcıdır. Odyometri testi, kişinin işitme eşiğini belirlemek ve işitme kaybını tespit etmek için kullanılırken, timpanometri testi kulak zarı problemlerini tespit etmek için kullanılır.

        Bu testler, işitme sağlığının değerlendirilmesinde önemli bir rol oynar ve işitme sorunlarına erken müdahale için önemli bir adımdır.</p>
    }
  ];

  const selectedUnit = units.find(u => u.id === selectedId);

  return (
    <div className="birimlerimiz-page">
      <div className="birimlerimiz-header">
        <h1 className="birimlerimiz-title">Birimlerimiz</h1>

        <div className="birimlerimiz-grid">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={`birim-card ${selectedId === unit.id ? 'selected' : ''}`}
              onClick={() => setSelectedId(unit.id)}
            >
              <img src={unit.icon} alt={unit.title} className="birim-card__icon" />
              <div className="birim-card__title">{unit.title}</div>
              <button className="birim-card__btn">
                {selectedId === unit.id ? 'İnceleniyor' : 'İncele'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="birim-content-section">
        <div className="birim-content-container">
          <div className="birim-content-header">
            <h2 className="birim-content-title">
              {selectedUnit?.contentTitle}
            </h2>
          </div>
          <div className="birim-content-text">
            {selectedUnit?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirimlerimizPage;
