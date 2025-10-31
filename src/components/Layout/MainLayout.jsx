// src/components/Layout/MainLayout.jsx (YENİ DOSYA)

import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Router'ın "placeholder"ı
import Menu from '../Menu/Menu';           // 2. Menümüz
import Footer from '../Footer/Footer';     // 3. Footer'ımız

// NOT: Bu component Menu.jsx'i import ettiği için,
// Menu.css dosyası da otomatik olarak yüklenecek.
// .site ve .main class'ları Menu.css içinde tanımlı,
// bu yüzden ekstra CSS importuna gerek yok.

export default function MainLayout() {
  return (
    <div className="main-page"> {/* Main_Page.jsx'teki ana sarmalayıcı */}
      <div className="site">      {/* Ana layout sarmalayıcısı */}
        <Menu />

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