import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './BolumlerimizPage.css';

const BolumlerimizPage = () => {
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(location.state?.selectedId || 'acil');

  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId);
    }
  }, [location.state]);

  const departments = [
    {
      id: 'acil',
      title: 'Acil 7/24',
      icon: '/b11.png', // Using png from public
      isAcil: true,
      contentTitle: 'Acil Polikliniği',
      content: (
        <>
          <p>
            Ani gelişen ve yaşam bütünlüğünü tehdit eden tüm sağlık sorunlarında, ilk
            müdahalenin hayati önem taşıdığının bilincindeyiz. Acil Servis Ünitemiz; alanında
            uzman hekimlerimiz ve deneyimli sağlık personelimizle, 7 gün 24 saat kesintisiz
            hizmet sunmaktadır.
          </p>
          <p>
            Tam donanımlı muayene ve müşahede odalarımızda, modern tıbbi cihazlarla
            hastalarımızın ilk değerlendirmesi, takibi ve tedavisi titizlikle yapılmaktadır. İleri tetkik
            veya tedavi gerektiren durumlarda ise hastalarımızın bir üst basamak sağlık
            kuruluşlarına güvenle sevki sağlanmaktadır.
          </p>
          <div className="bolum-tags">
            <span>Muayene</span>
            <span>Müdahale</span>
            <span>Müşahede</span>
            <span>Enjeksiyon</span>
            <span>Pansuman</span>
            <span>Tansiyon Ölçümü</span>
            <span>EKG</span>
            <span>Dikiş Alma</span>
            <span>Şeker Ölçümü</span>
            <span>Sürücü Raporu</span>
            <span>İş Göremezlik Raporu</span>
            <span>Sağlık Raporu</span>
          </div>
        </>
      )
    },
    {
      id: 'dis',
      title: 'Ağız ve Diş',
      icon: '/b22.png',
      contentTitle: 'Ağız ve Diş Sağlığı',
      content: (
        <>
          <p>
            Uzman hekimlerimiz ve donanımlı kliniklerimizle diş sağlığınızı korumak için çalışıyoruz.
            Çocuk diş hekimliğinden estetik uygulamalara, kanal tedavisinden implant cerrahisine kadar tüm ihtiyaçlarınızda,
            deneyimli kadromuzla güvenilir tedavi hizmeti sunuyoruz.
          </p>
          <div className="bolum-tags">
            <span>İmplant</span>
            <span>Cerrahi Diş Çekimi</span>
            <span>Panoramik Röntgen</span>
            <span>Pedodonti</span>
            <span>Endodonti</span>
            <span>Restoratif Diş Tedavisi</span>
            <span>Diş Beyazlatma</span>
            <span>Zirkonyum</span>
            <span>Gülüş Tasarımı</span>
          </div>
        </>
      )
    },
    {
      id: 'diyet',
      title: 'Beslenme Diyet',
      icon: '/b3diyet.png',
      contentTitle: 'Beslenme ve Diyet',
      content: (
        <>
          <p>
            Beslenme ve Diyet Polikliniğimizde sağlıklı yaşamı desteklemek, kilo yönetimi sağlamak, hastalıkların önlenmesi ve tedavi süreçlerini desteklemek için profesyonel bir diyet ve beslenme danışmanlığı sunuyoruz. Her bireyin sağlığına ve yaşam tarzına uygun, kişiye özel beslenme planları oluşturarak, sürdürülebilir bir sağlıklı yaşam alışkanlığı kazanmanıza yardımcı oluyoruz.
          </p>
          <p>
            Polikliniğimizde uzman diyetisyenlerimiz tarafından yapılan kapsamlı değerlendirmeler sonrasında, vücut analizi, metabolik hız ve ihtiyaç analizleri yapılmakta, kilo yönetiminden hastalıklara özel beslenme planlarına kadar birçok alanda destek sağlanmaktadır. Sağlıklı bir geleceğe adım atarken, yaşam kalitenizi artıracak diyet ve beslenme önerilerimizle yanınızdayız.
          </p>

          <h3 style={{ marginTop: '20px', marginBottom: '10px', color: '#2d7bf0ff', fontWeight: 'bold' }}>HİZMETLERİMİZ</h3>

          <div className="bolum-tags">
            <span>Beslenme</span>
            <span>Tiroit Hastalıklarında Beslenme</span>
            <span>Sindirim Ağırlık kaybı</span>
            <span>Ağırlık kazanımı</span>
            <span>Gebelikte ve Laktasyon Döneminde Beslenme</span>
            <span>Diyabette Sistemi Hastalıklarında Beslenme</span>
            <span>PKOS/Besin Alerjileri</span>
            <span>Kalp ve Damar Hastalıklarında</span>
            <span>Beslenme Karaciğer Hastalıklarında Beslenme</span>
            <span>Böbrek Hastalıklarında</span>
            <span>Beslenme Bebeklik/Çocukluk ve Ergenlik Çağı Beslenmesi</span>
            <span>Obezitede Beslenme</span>
            <span>Sporcu Beslenmesi</span>
            <span>Engelli Bireylerde</span>
            <span>Beslenme Enteral ve Parenteral Beslenme</span>
            <span>Fitoterapi</span>
          </div>

          <div className="bolum-detail-list">
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Kişiye Özel Beslenme Programı</span>
              Kişiye özel hazırlanan beslenme programları, detaylı bir çalışma sonucu ortaya çıkmış ve tamamen bireyin yaşam şekli ve değerlerine göre hazırlanmış bir diyet programıdır.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Yaşam Koçluğu</span>
              Yaşam koçu, gerekli eğitimleri tamamlamış, alanında uzman kişidir. Danışanıyla bire bir ilgilenerek kişinin kendi potansiyelini keşfetmesi, geliştirmesi, kişisel hedeflerini tanımlaması üzerine doğru soruları sorar ve danışanı harekete geçirmek için uygun stratejiler geliştirir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Sağlık Beslenme ve Kilo Alma</span>
              Diyet veya Diyetisyenlik hizmeti yalnızca kilo vermek olarak algılanmamalıdır. Sağlıklı kilo almakta diyetisyen hizmetleri arasındadır. Travma sonrası, hastalık veya başka sebeplerden kaynaklanan kilo kaybını sağlıklı bir şekilde engellemek için sunulan hizmettir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Sağlıklı Beslenme ve Kilo Verme</span>
              Diyetisyenlik hizmeti denildiğinde akla ilk gelen işlem “Kilo vermek” tir. Kas kütlesinden kaybetmeden, besinlerin ve fiziksel aktivitelerin düzenlenerek danışanın sağlıklı kilosuna inmesine yardımcı olmak üzere sunulan hizmettir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">İştah Yönetimi ve Kilo Kontrolü</span>
              Kilo vermede en önemli unsur iştah kontrolüdür. Bu psikolojik şartlanma gerektirdiği kadar fiziksel olarak ta desteklenmelidir. Sindirimi uzun süren ve kan şekerini artırmayan gıdalar bu süreçte tercih edilmelidir. Kişinin metabolik hızına ve yaşam tarzına bağlı olarak bu bağlamda sunulan hizmettir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Çocuk Beslenmesi</span>
              Bulunduğu yaş ve detaylı vücut analizi sonucunda genç bireyin eksiksiz bir gelişim adına tüketmesi gereken tüm gıdaları içeren özel diyet sistemidir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Diyabet Hastalığında Beslenme</span>
              Beyaz ekmek, makarna, pirinç, mısır, mısır gevreği, şekerli gıdalar yerine meyve, sebze, tam tahıl, kuru baklagiller (fasulye, nohut, bezelye ve mercimek) ve düşük yağ içeren süt ürünleri gibi sağlıklı karbonhidratlar tercih edilmelidir. Bu süreçte tercih edilen gıdaların kontrollü bir yükleme ile vücuda girmesi oldukça önemlidir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Kurumsal Beslenme Danışmanlığı</span>
              Kurumsal beslenme danışmanlığı; beslenme alanındaki sağlık profesyonelleri tarafından uygulanan, çalışların ve yöneticilerin iş hayatlarındaki performansını ve yaşam kalitelerini artırmak için alınan hizmettir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Sporcu Beslenmesi</span>
              Sporcunun fiziksel aktivite yoğunluğu göz önünde bulundurularak düzenlenen özel diyetisyenlik hizmetidir. Proteinin maksimum emilimini ve minimum kas kaybını hedefler. Sporcular için hızlı kilo almak veya hızlı kilo vermek üzere sunulan özel diyet hizmetidir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Hamilelik Döneminde Beslenme</span>
              Hamilelik döneminin başından sonuna kadar devam eden, hem annenin hem de bebeğin ihtiyacı olan tüm besinlerin, bebek adına eksiksiz bir gelişime ve anne adınasağlıklı bir metabolizmaya sahip olması adına, özel olarak hesaplandığı özel diyetisyenlik hizmetidir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Emzirme Döneminde Beslenme</span>
              Anne sütünün en verimli formunda olması bebeğin beyin gelişimi, fiziksel ve metabolik sağlığı için oldukça önemlidir. Emzirme döneminde diyetisyenlik hizmeti her annenin muhakkak alması gereken bir hizmettir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Hipertansiyonda beslenme</span>
              Hipertansiyon hastası bireylerin taze sebze ve meyve, kurubaklagil, düşük yağlı süt ürünleri, tam tahıllı ürünler, balık ve doymamış yağlardan zengin sağlıklı ve dengeli bir diyet tüketmesi önerilmektedir. Bu hastalarda kırmızı et tüketimi, doymuş yağ tüketimi ve şekerli besinleri sınırlandırmak hedeflenmektedir. Bu süreçte bireyin diyetinin kontrol altında tutulması oldukça önemlidir.
            </div>
            <div className="bolum-detail-card">
              <span className="bolum-detail-title">Ayrıntılı Vücut Analizi ve Yorumlanması</span>
              Diyetinize başlamadan önce yapılması gereken, vücudun kas, yağ ve su oranını belirleyen ölçüme vücut analizi denir. Yapılan ölçümler referans değerlerle kıyaslanır. Tedavi süreci boyunca hastanın değerleri baştan sona kayıt edilir ve yorumlanır.
            </div>
          </div>
        </>
      )
    },
    {
      id: 'derma',
      title: 'Dermatoloji',
      icon: '/b44.png',
      contentTitle: 'Dermatoloji',
      content: (
        <>
          <p>
            Dermatoloji bir diğer ismi ile Deri ve Zührevi Hastalıkları, vücudumuzun en büyük organı olan ve birçok önemli görevi yerine getiren “deri” ile ilgili tıbbi birimdir.
          </p>
          <p>
            Dermatoloji yalnızca derinin kendisini değil derinin bir uzantısı halinde gelişen saçı ve tırnakları, ağız ve burun mukozalarını, cinsel yolla bulaşan hastalıkların tespit ve tedavisini gerçekleştirmektedir. Dermatolojik anlamda en sık rastlanan hastalıklar ise genel olarak; Siğiller, Sivilceler, Sedef (Psoriasis), Vitiligo, Behçet Hastalığı, Egzama, Mantar Enfeksiyonları, Uçuk (Herpes Simleks), Skabiyez (Uyuz), Kurdeşen (Ürtiker), Yanıklar.
          </p>
          <p>
            Dış görünüşte dikkat çeken dermatolojik rahatsızlıklar kimi zaman estetik olarak da sorun olabilmekte ve daha ciddi bir sağlık sorununa dönüşebilmektedirler. Bundan dolayı hastalığın ileri seviyelere ulaşmaması için hızlı bir tedavi sürecine geçilmelidir. Her biri alanında uzman doktorumuz, gerekli tanı ve tedavi programları ile en kısa sürede hastalığın atlatılmasına katkı sağlamaktadır.
          </p>
          <div className="bolum-tags">
            <span>Sivilceler(akne)</span>
            <span>Pruritus (kaşıntı)</span>
            <span>Ürtiker (Kurdeşen)</span>
            <span>Parazit kaynaklı deri hastalıkları (Bitler, uyuz vb.)</span>
            <span>Mantar hastalıkları (tırnak, ayak, el, gövde, genital bölgei saçlı deri vb.)</span>
            <span>Egzama rahatsızlıkları (temas egzamaları, seboreik egzama, atopik dermatit vb.)</span>
            <span>Sedef, liken ve benzeri dermatitler</span>
            <span>Saç hastalıkları (kepeklenme, saç derisi egzamaları, genetik saç dökülmeleri vb.)</span>
            <span>Behçet hastalığı</span>
            <span>Büllü hastalıklar</span>
            <span>Deride iyi ve kötü huylu tümörler</span>
            <span>Bağ dokusunda meydana gelen hastalıklar</span>
            <span>Pigmentasyon bozuklukları (güneş lekeleri, vitiligo, çiller vb.)</span>
            <span>Enfeksiyöz/bulaşıcı döküntülü hastalıklar (kızıl, kızamıkçık, su çiçeği, zona vb.)</span>
            <span>Alerjik cilt hastalıkları (böcek sokmaları, gıda alerjileri, ilaç alerjileri vb.)</span>
            <span>Cinsel yolla bulaşan hastalıklar ( Genital siğil, uçuk, sifiliz gibi enfeksiyöz hastalıklar)</span>
            <span>Güneş alerjisi</span>
            <span>Hirşutizm (aşırı tüylenme)</span>
            <span>Hiperhidroz (aşırı terleme)</span>
            <span>Nasırlar ve siğiller</span>
            <span>Benler</span>
            <span>Damarsal deri hastalıkları</span>
            <span>Tırnak hastalıkları</span>
            <span>Dudak, dil ve ağız içi hastalıkları (aftlar, uçuklar ve ağız içinde oluşan diğer hastalıklar</span>
            <span>Beslenme ve metabolik bozukluklara bağlı cilt hastalıkları</span>
            <span>Psikolojik sebeplere bağlı cilt hastalıkları</span>
            <span>Sistemik hastalıklarda ortaya çıkan cilt bulguları</span>
            <span>Genetik sebeplere bağlı deri hastalıkları</span>
            <span>Fiziksel faktörlere bağlı rahatsızlıklar (sıcağa veya soğuğa tepkimeler, yabancı cisim tepkimeleri vb.)</span>
          </div>
        </>
      )
    },
    {
      id: 'cerrahi',
      title: 'Genel Cerrahi',
      icon: '/b55.png',
      contentTitle: 'Genel Cerrahi',
      content: (
        <>
          <p>
            Genel cerrahi, vücuttaki sistemik ve yerel hastalıkları cerrahi yöntemle tedavi eden, pek çok tıbbi branş ile entegre olarak çalışan bir disiplindir. Cerrahi tıbbın en eski branşlarından biri olmakla birlikte, ilaç veya diğer tedavi biçimleriyle iyileştirilemeyenhastalıkların, yaralanmaların ve yapısal bozuklukların ameliyatla düzeltilmesi ya da hastalıklı kısmın kesip çıkartılarak bölgenin doğal hale getirilmesi prensibine dayanır.
          </p>
          <p>
            Guatr (Tiroid bezi), Mide, İnce Bağırsak, Kalın Bağırsak, Meme, Yemek Borusu(Özofagus), Fıtıklar, Karaciğer, Rektum, Anüs, Safra Kesesi, Safra Yolları, Endoskopik ve Laparoskopik Cerrahi girişimleri Genel Cerrahi alanına giren bölümler olarak sayılabilir. Genel Cerrahi sadece ameliyatlarla değil, koruyucu hekimlik ile ameliyattan korunmayla da ilgilenir.
          </p>
          <div className="bolum-tags">
            <span>Endoskopi</span>
            <span>Kolonoskopi</span>
            <span>Tırnak Çekimi</span>
            <span>Genel/Lokal Anestezi Sünnet</span>
            <span>Hemoroid</span>
            <span>Anal Fissür</span>
            <span>Anal Fistül</span>
            <span>Pilonidal Kist (Kıl Dönmesi)</span>
            <span>İnguinal Herni (Kasık Fıtığı)</span>
            <span>Umbilikal Herni(Göbek Fıtığı)</span>
            <span>Perianal Apse</span>
            <span>Kitle Çıkarılması</span>
            <span>Et Beni Alımı</span>
            <span>Guatr (Tiroid)</span>
            <span>Varis</span>
            <span>Mide Karın Ve Kasık Fıtığı</span>
            <span>Karın Ağrısı</span>
            <span>Mide Ağrısı</span>
            <span>Vücutta Kızarıklık</span>
            <span>Göğüste Ağrı/Kitle</span>
            <span>Koltuk Altında Kitle</span>
            <span>Makatta Ağrı Kanama</span>
            <span>Kuyruk Sokumu Ağrı Şişlik</span>
          </div>
        </>
      )
    },
    {
      id: 'goz',
      title: 'Göz Sağlığı',
      icon: '/b6goz.png',
      contentTitle: 'Göz Sağlığı',
      content: (
        <>
          <p>
            Göz Sağlığı ve Hastalıkları, yaşam kalitesi açısından oldukça büyük öneme sahiptir. Bazı göz hastalıkları erken dönemde tedavi edilmediklerinde ilerleyerek görme kaybına varan kalıcı hasarlara neden olabilir.
          </p>
          <p>
            Bu nedenle düzenli göz muayenesi yaptırmak ve gözlerdeki olası hastalıkları ilerlemeden tespit etmek büyük önem taşır. Sağlıklı insanlar yılda bir kez göz taramasından geçmeli, göz sağlığına ilişkin herhangi bir şikâyeti bulunanlar Göz Sağlığı ve Hastalıkları bölümüne muayene olmalıdır.
          </p>
          <div className="bolum-tags">
            <span>Genel Muayene</span>
            <span>Göz Kızarıklığı</span>
            <span>Kaşıntı</span>
            <span>Yanma</span>
            <span>Batma</span>
            <span>Glokom (Göz Tansiyonu)</span>
            <span>Gözlük / Lens Reçetesi</span>
            <span>Renk Görme (Körlüğü)</span>
            <span>Şaşılık</span>
            <span>Diyabetik Retinopati</span>
            <span>Katarakt Tespiti</span>
            <span>Nistagmus Tespiti</span>
            <span>Arpacık</span>
            <span>Keratit</span>
            <span>İlaç Raporu</span>
            <span>Sürücü Belgesi</span>
            <span>Şoför Kartı ( EK-7 RAPORU )</span>
          </div>
        </>
      )
    },
    {
      id: 'dahiliye',
      title: 'İç Hastalıklar',
      icon: '/b77.png', // Using the complex filename found
      contentTitle: 'İç Hastalıkları (Dahiliye)',
      content: (
        <>
          <p>
            Kurumumuzun Dahiliye polikliniğinde; uzman doktorumuz ile Bronşit, Nezle, Sistit vb. enfeksiyon hastalıkları, Diyabet, Hipertansiyon, Guatr gibi metabolik hastalıklar çarpıntı, Kalp Yetmezliği gibi kalp hastalıkları, Akdeniz Anemisi ( Talasemi ) gibi hematolojik hastalıkların teşhis ve tedavisi yapılabilmekte, böbrek kistleri gibi nefrolojik hastalıklar ülser, irritabl kolon, ishal gibi Gastrointestinal hastalıklar, Kas, Eklem Ağrıları, Romatoid Artrit, Romatizmal Hastalıkların ön tanıları ve takipleri yapılıpgerekli uzman hekimlerimize yönlendirme yapılmaktadır. Hastalığın erken tanı ve tedavisinde gerekli olan tüm laboratuvar, röntgen, ultrason, EKG, mikrobiyoloji testleri en yeni ve modern şekli ile uzman personel kadromuz tarafından tıp merkezimizde başarı ile yapılmaktadır.
          </p>
          <div className="bolum-tags">
            <span>Kan Hastalıkları (Anemiler)</span>
            <span>Solunum Enfeksiyonları</span>
            <span>Böbrek Hastalıkları</span>
            <span>Kalp Yetersizliği</span>
            <span>Ritm Bozuklukları</span>
            <span>Hipertansiyon</span>
            <span>Lipid düzeyi (Kolestrol, Trigliserid) Bozuklukları</span>
            <span>Diabetus Mellitus (Şeker Hastalığı)</span>
            <span>KOAH</span>
            <span>Tiroid Bezi Bozuklukları (Guatr)</span>
            <span>Obezite</span>
            <span>Karaciğer Hastalıkları</span>
            <span>Reflü, gastrit, ülser, kabızlık, kolit gibi Sindirim Sistemi Hastalıkları</span>
            <span>Yaşlılık ve yaşlılığa bağlı sorunlar (Geriatri)</span>
            <span>Ateşli Hastalıklar</span>
            <span>Romatizmal Hastalıklar ve Ateşli Eklem Romatizması</span>
          </div>
        </>
      )
    },
    {
      id: 'kadin',
      title: 'Kadın & Doğum',
      icon: '/b88.png',
      contentTitle: 'Kadın Hastalıkları ve Doğum',
      content: (
        <>
          <p>
            Kendi alanında, tıp dünyasındaki her gelişimi yakından izleyen ve uygulayan kliniğimiz,hamilelik, doğum öncesi ve doğumla ilgili problemlerin çözümünde de modern tıbbın tüm olanaklarıyla hizmet vermektedir. Ergenlikten başlayarak menopoz döneminekadar her yaştan kadının, genel kadın sağlığı rutin kontrollerinden, doğum kontrolü, riskli ve normal gebeliklerin takibi, menopoz ve osteoporoz şikayeti ile gelen hastaların tedavileri yapılmaktadır.
          </p>
          <div className="bolum-tags">
            <span>Genel Muayene</span>
            <span>Kist Muayene</span>
            <span>Myom Muayene</span>
            <span>Ec Muayene</span>
            <span>Gebelik Takibi</span>
            <span>Ria Takılması</span>
            <span>Ria Çıkarılması</span>
            <span>Servikal Smear</span>
            <span>Servikal Koter</span>
            <span>İlaç Muafiyet Raporu</span>
            <span>Mirena Takılması</span>
            <span>Pc Terapötik Küretaj</span>
            <span>Endometrial Biyopsi</span>
            <span>Hpv Dna Smear</span>
            <span>Hpv Genotipleme</span>
            <span>Servikal Polip Çıkarılması</span>
            <span>Tıbbi Nedenli Tahliye</span>
            <span>Bartholin Apse Drenajı</span>
            <span>Labioplasti</span>
            <span>Rektosel</span>
            <span>Sistosel</span>
            <span>Sistorektosel</span>
            <span>Mcdonald – Schirodkar</span>
            <span>Gartner Ve İnklüzyon Kisti</span>
            <span>Normal Doğum</span>
            <span>Sezaryen Doğum</span>
          </div>
        </>
      )
    }
  ];

  const selectedDept = departments.find(d => d.id === selectedId);

  return (
    <div className="bolumlerimiz-page">
      <div className="bolumlerimiz-header">
        <h1 className="bolumlerimiz-title">Tüm Bölümlerimiz</h1>

        <div className="bolumlerimiz-grid">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className={`bolum-card ${selectedId === dept.id ? 'selected' : ''} ${dept.isAcil ? 'is-acil' : ''}`}
              onClick={() => setSelectedId(dept.id)}
            >
              <img src={dept.icon} alt={dept.title} className="bolum-card__icon" />
              <div className="bolum-card__title">{dept.title}</div>
              <img src="/angle-right.svg" alt="" className="card-arrow-icon" width="24" height="24" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="bolum-content-section">
        <div className="bolum-content-container">
          <div className="bolum-content-header">
            <h2
              className="bolum-content-title"
              style={{ color: selectedDept?.isAcil ? '#cc0000' : '#0052cc' }}
            >
              {selectedDept?.contentTitle}
            </h2>
          </div>
          <div className="bolum-content-text">
            {selectedDept?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BolumlerimizPage;
