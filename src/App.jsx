// src/App.jsx (SON VE GÜNCEL HALİ - DÜZLEŞTİRİLMİŞ ROTALAR)

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
import ContactPage from './components/pages/ContactPage';
import EvdeSaglikPage from './components/pages/EvdeSaglikPage';
import PersonelLoginPage from './components/pages/PersonelLoginPage'; 

// Layoutlar ve Korumalar
import MainLayout from './components/Layout/MainLayout'; 
import ProtectedStaffRoute from './components/Layout/ProtectedStaffRoute'; 

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
        <Route path="contact" element={<ContactPage />} />
        <Route path="evde-saglik" element={<EvdeSaglikPage />} />
        <Route path="hekimlerimiz" element={<DoctorsPage />} />
        <Route path="doktor-sec" element={<SelectDoctorPage />} />
        <Route path="randevu" element={<AppointmentPage />} />
        <Route path="kurumsal" element={<KurumsalPage />} />
        <Route path="bolumlerimiz" element={<BolumlerimizPage />} />
        <Route path="birimlerimiz" element={<BirimlerimizPage />} />
      </Route>

      {/* 2. Personel Giriş Sayfası (Bağımsız - Layout Yok) */}
      <Route path="/personelLogin" element={<PersonelLoginPage />} />

      {/* 3. Personel Panelleri (Korumalı ve Bağımsız - KISA YOLLAR) */}
      <Route element={<ProtectedStaffRoute />}>
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/doctor-panel" element={<DoctorPanel />} />
        <Route path="/lab-panel" element={<LabPanel />} />
        <Route path="/cashier-panel" element={<CashierPanel />} />
        <Route path="/cleaner-panel" element={<CleanerPanel />} />
      </Route>
    </Routes>
  );
}