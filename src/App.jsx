// App.jsx (SON HALİ)

import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import DoctorsPage from './components/pages/DoctorsPage';
import AppointmentPage from './components/pages/AppointmentPage';
import KurumsalPage from './components/pages/KurumsalPage';
import BolumlerimizPage from './components/pages/BolumlerimizPage';
import BirimlerimizPage from './components/pages/BirimlerimizPage';
import SelectDoctorPage from './components/pages/SelectDoctorPage';

// Sayfalar
import LoginPage from './components/pages/LoginPage'; 
import RegisterPage from './components/pages/RegisterPage'; 
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import ContactPage from './components/pages/ContactPage';
import EvdeSaglikPage from './components/pages/EvdeSaglikPage';

// Layoutlar ve Korumalar
import MainLayout from './components/Layout/MainLayout'; 
// DÜZELTME BURADA: Dosya adı ProtectedPersonnelRoute olduğu için importu düzelttik
import ProtectedPersonnelRoute from './components/Layout/ProtectedPersonnelRoute'; 

// Paneller
import AdminPanel from './components/pages/panels/AdminPanel';
import DoctorPanel from './components/pages/panels/DoctorPanel';
import LabPanel from './components/pages/panels/LabPanel';
import CashierPanel from './components/pages/panels/CashierPanel';
import CleanerPanel from './components/pages/panels/CleanerPanel';

export default function App() {
  return (
    <Routes>
      {/* 1. Standart Sayfalar (Menü + Footer Var) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} /> 
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} /> 

        {/* İletişim Rotası */}
        <Route path="contact" element={<ContactPage />} />
        <Route path="evde-saglik" element={<EvdeSaglikPage />} />

        {/* Gelecekte eklenecek "Hekimlerimiz", "Bölümlerimiz" gibi
            tüm yeni sayfalar da buraya eklenecek */}
        
      </Route>
    </Routes>
  );
}