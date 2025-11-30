<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import DoctorsPage from './components/pages/DoctorsPage';
// Eğer ismini değiştirdiyseniz BookAppointmentPage yapın, değiştirmediyseniz böyle kalsın:
import AppointmentPage from './components/pages/AppointmentPage'; 
=======
<<<<<<< HEAD
// src/App.jsx (DÜZELTİLMİŞ)
=======
// src/App.jsx (SON VE GÜNCEL HALİ - DÜZLEŞTİRİLMİŞ ROTALAR)
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc

import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import DoctorsPage from './components/pages/DoctorsPage';
import AppointmentPage from './components/pages/AppointmentPage';
>>>>>>> main
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
import PersonelLoginPage from './components/pages/PersonelLoginPage'; 
<<<<<<< HEAD
import VerifyEmailPage from './components/pages/VerifyEmailPage';

// ✅ YENİ EKLENEN IMPORT (Burası eksikti)
import PatientProfilePage from './components/pages/PatientProfilePage';

// Layoutlar ve Korumalar
import MainLayout from './components/Layout/MainLayout'; 
import ProtectedPersonnelRoute from './components/Layout/ProtectedPersonnelRoute'; 

// New Dashboard System
import DashboardLayout from './components/Dashboard/DashboardLayout';
import DashboardHome from './components/Dashboard/DashboardHome';
import PersonnelPage from './components/Dashboard/PersonnelPage';
import AppointmentsPage from './components/Dashboard/AppointmentsPage';
import PatientsPage from './components/Dashboard/PatientsPage';
import LeaveRequestsPage from './components/Dashboard/LeaveRequestsPage';
import ContactFormsPage from './components/Dashboard/ContactFormsPage';
import LabResultsPage from './components/Dashboard/LabResultsPage';
import CleaningManagementPage from './components/Dashboard/CleaningManagementPage';
import CleanerDashboard from './components/Dashboard/CleanerDashboard';
import CashierDashboard from './components/Dashboard/CashierDashboard';
import LabTechDashboard from './components/Dashboard/LabTechDashboard';
import PatientDashboard from './components/Dashboard/PatientDashboard';
import NotificationsPage from './components/Dashboard/NotificationsPage';
import AdminNotificationSender from './components/Dashboard/AdminNotificationSender';
import ProfilePage from './components/Dashboard/ProfilePage';
=======

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
>>>>>>> main

export default function App() {
  return (
    <Routes>
      {/* 1. Standart Sayfalar (Menü + Footer Var) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainPage />} /> 
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} /> 
<<<<<<< HEAD
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
=======
>>>>>>> main
        <Route path="contact" element={<ContactPage />} />
        <Route path="evde-saglik" element={<EvdeSaglikPage />} />
        <Route path="hekimlerimiz" element={<DoctorsPage />} />
        <Route path="doktor-sec" element={<SelectDoctorPage />} />
        <Route path="randevu" element={<AppointmentPage />} />
        <Route path="kurumsal" element={<KurumsalPage />} />
        <Route path="bolumlerimiz" element={<BolumlerimizPage />} />
        <Route path="birimlerimiz" element={<BirimlerimizPage />} />
<<<<<<< HEAD
        <Route path="verify-email" element={<VerifyEmailPage />} />

        {/* ✅ YENİ EKLENEN ROTA (Burası eksikti) */}
        <Route path="hasta-profil" element={<PatientProfilePage />} />
      </Route>

      {/* 2. Personel Giriş Sayfası (Bağımsız - Layout Yok) */}
      <Route path="/personelLogin" element={<PersonelLoginPage />} />

      {/* 3. New Dashboard System (Protected Routes) */}
      <Route element={<ProtectedPersonnelRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          
          {/* Admin Routes */}
          <Route path="personnel" element={<PersonnelPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="leave-requests" element={<LeaveRequestsPage />} />
          <Route path="contact-forms" element={<ContactFormsPage />} />
          <Route path="lab-results" element={<LabResultsPage />} />
          <Route path="cleaning" element={<CleaningManagementPage />} />
          <Route path="notifications-sender" element={<AdminNotificationSender />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Cleaner Routes */}
          <Route path="cleaner" element={<CleanerDashboard />} />
          
          {/* Cashier Routes */}
          <Route path="payments" element={<CashierDashboard />} />
          
          {/* Lab Tech Routes */}
          <Route path="lab-tests" element={<LabTechDashboard />} />
          
          {/* Patient Routes */}
          <Route path="my-appointments" element={<PatientDashboard />} />
          
          {/* Shared Routes */}
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
=======
      </Route>

      {/* 2. Personel Giriş Sayfası (Bağımsız - Layout Yok) */}
      <Route path="/personelLogin" element={<PersonelLoginPage />} />

      {/* 3. Personel Panelleri (Korumalı ve Bağımsız - KISA YOLLAR) */}
<<<<<<< HEAD
      {/* DÜZELTME BURADA: ProtectedPersonnelRoute kullanıldı */}
      <Route element={<ProtectedPersonnelRoute />}>
=======
      <Route element={<ProtectedStaffRoute />}>
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/doctor-panel" element={<DoctorPanel />} />
        <Route path="/lab-panel" element={<LabPanel />} />
        <Route path="/cashier-panel" element={<CashierPanel />} />
        <Route path="/cleaner-panel" element={<CleanerPanel />} />
>>>>>>> main
      </Route>
    </Routes>
  );
}