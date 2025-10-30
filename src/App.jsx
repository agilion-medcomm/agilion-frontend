// App.jsx (SON HALİ)

import { Routes, Route } from 'react-router-dom';
import MainPage from './Main_Page';

// Sayfalarımızı import ediyoruz
// (Senin klasör yapına göre import yolu)
import LoginPage from './components/pages/LoginPage'; 
import RegisterPage from './components/pages/RegisterPage'; // <-- YENİ EKLENEN SATIR

// Ana yerleşim (Layout) component'imizi import ediyoruz
import MainLayout from './components/Layout/MainLayout'; 

export default function App() {
  return (
    <Routes>
      {/* Ana Layout Rotası:
        Bu rota, MainLayout'u (Menü + Footer) render eder.
        içindeki diğer rotalar, bu layout'un <Outlet />'ine yerleşir.
      */}
      <Route path="/" element={<MainLayout />}>

        {/* Anasayfa Rotası */}
        <Route index element={<MainPage />} /> 
        
        {/* Login Rotası */}
        <Route path="login" element={<LoginPage />} />
        
        {/* Kayıt Ol Rotası */}
        <Route path="register" element={<RegisterPage />} /> 
        
        {/* Gelecekte eklenecek "Hekimlerimiz", "Bölümlerimiz" gibi
            tüm yeni sayfalar da buraya eklenecek */}
        
      </Route>
    </Routes>
  );
}