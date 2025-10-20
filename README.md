**20 Ekim Pazartesi 2025**
# Agilion MedComm – Frontend (React)

Bu proje, **Zeytinburnu Tıp Merkezi** için geliştirilen web uygulamasının frontend kısmını içerir.  
Ana amaç, kullanıcıların **randevu alabileceği, doktor ve hizmet bilgilerini görüntüleyebileceği** modern bir arayüz oluşturmak.

---

## Kullanılan Teknolojiler
- **React (Vite)** – Modern frontend framework  
- **JavaScript (ES6)**  
- **HTML5 & CSS3**  
- **Git / GitHub (collaboration & branching)**

---

## Kurulum Adımları
Aşağıdaki adımlar, projeyi kendi bilgisayarınızda çalıştırmanı sağlar.

  **Not:** Bu komutları çalıştırmadan önce bilgisayarınızda  
  > [Node.js](https://nodejs.org/) (v16 veya üzeri) ve [Git](https://git-scm.com/) yüklü     olmalıdır.

### Proje klasörünü oluştur ve terminali aç
Bilgisayarınızda istediğiniz bir konumda (örneğin `Masaüstü` veya `C:\Projects`) bir klasör açın. Sonra terminali açın.


1. Bu repoyu kendi bilgisayarınıza aktarın (proje dosyalarını indirin), sonra dizine geçin:
       **git clone https://github.com/agilion-medcomm/agilion-frontend.git**
       (bu komutu yazdıktan sonra mevcut dizinde agilion-frontend dizini otomatik oluşur)
       **cd agilion-frontend**
3. Gerekli bağımlılıkları yükle:
       **npm install**
       (Bu komut, React ve diğer gerekli dosyaları yükler (bu adım bir kez yapılır).)
4. Geliştirmeyi başlatın
       **npm run dev**
       Tarayıcıda şu adresi açın: **http://localhost:5173**


## Git Kavramları
**Main Branch**: 
Ana proje dosyalarının bulunduğu, en stabil koddur.
→ Bu dala doğrudan push yapılmaz.
**Branch**: 
Her geliştiricinin kendi çalışmasını yaptığı yan koldur.
→ Yeni özellik eklerken veya hata düzeltirken kullanılır.
**Push**: Yaptığın değişiklikleri GitHub’a yüklemek.
**Pull Request (PR)**:
Yaptığın değişiklikleri ekibe sunarak “main” dalına eklenmesi için istekte bulunmak.

## Branch ve Commit Kuralları
main dalına doğrudan push yapılmaz.
Her görev için ayrı bir feature branch açılır.

1. Yeni branch açma
       git checkout -b feature/FE-[numara]-[kısa-açıklama]
       //örnek: git checkout -b feature/FE-1-navbar
2. Commit mesajı formatı
       feat: açıklama  → yeni özellik  
       fix: açıklama   → hata düzeltmesi  
       style: açıklama → tasarım / düzenleme
       //örnek: feat: add responsive navbar component


## Pull Request (PR) Süreci
A. Güncelleme yaptıktan sonra sırasıyla şu komutlar girilmeli:
  1: git add .
  2: git commit -m "feat: açıklama"
  3. git push origin feature/FE-[numara]-[açıklama]
B. GitHub’da “Compare & Pull Request” butonuna tıkla.
C. Açtığın PR, takım arkadaşların tarafından incelenecek.
D. En az 1 onay alındıktan sonra merge edilir.
E. Merge sonrası kendi branch’ini silebilirsin.
   -> Branch silme: 
      1. Önce “main” dalına geç:
         git checkout main
      2. Yerel (bilgisayardaki) branch’i sil:
         git branch -d feature/FE-1-navbar
      3. GitHub’daki (uzaktaki) branch’i de sil:
         git push origin --delete feature/FE-1-navbar
## Hangi dizinde çalışılmalı?
Bu komutların tamamı, projenin klonlandığı klasörün içinde (örneğin agilion-frontend) çalıştırılır.
Yani terminalde dizin şu şekilde olmalı: ~/Desktop veya Downloads/agilion-frontend
    
     



Oluşturan: Emre Kaan Şahin
