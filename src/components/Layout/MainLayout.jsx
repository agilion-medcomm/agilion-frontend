// src/components/Layout/MainLayout.jsx (YENİ DOSYA)

import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Router'ın "placeholder"ı
import Menü from '../Menü/Menü';           // 2. Menümüz
import Footer from '../Footer/Footer';     // 3. Footer'ımız

// NOT: Bu component Menü.jsx'i import ettiği için,
// Menü.css dosyası da otomatik olarak yüklenecek.
// .site ve .main class'ları Menü.css içinde tanımlı,
// bu yüzden ekstra CSS importuna gerek yok.

export default function MainLayout() {
  return (
    <div className="main-page"> {/* Main_Page.jsx'teki ana sarmalayıcı */}
      <div className="site">      {/* Ana layout sarmalayıcısı */}
        <Menü />

        <main className="main">
          {/* <Outlet />: "Hangi sayfadaysak (MainPage, LoginPage)
              onun içeriğini buraya bas" demektir. */}
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}