import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainPage from './MainPage';
import DoctorsPage from './components/pages/DoctorsPage';
import DoctorBioPage from './components/pages/DoctorBioPage';
import AppointmentPage from './components/pages/AppointmentPage';
import KurumsalPage from './components/pages/KurumsalPage';
import BolumlerimizPage from './components/pages/BolumlerimizPage';
import BirimlerimizPage from './components/pages/BirimlerimizPage';
import SelectDoctorPage from './components/pages/SelectDoctorPage';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPasswordPage from './components/pages/ForgotPasswordPage';
import ResetPasswordPage from './components/pages/ResetPasswordPage';
import ContactPage from './components/pages/ContactPage';
import EvdeSaglikPage from './components/pages/EvdeSaglikPage';
import PersonelLoginPage from './components/pages/PersonelLoginPage';
import VerifyEmailPage from './components/pages/VerifyEmailPage';
import ClarificationTextPage from './components/pages/ClarificationTextPage';
import ResendVerificationPage from './components/pages/ResendVerificationPage';

import MainLayout from './components/Layout/MainLayout';
import ProtectedPersonnelRoute from './components/Layout/ProtectedPersonnelRoute';

import { usePersonnelAuth } from './context/PersonnelAuthContext';
import { useAuth } from './context/AuthContext';

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
import ProfilePage from './components/Dashboard/ProfilePage';
import LaborantDashboard from './components/Dashboard/LaborantDashboard';
import DoctorDisplayPage from './components/Dashboard/DoctorDisplayPage';
import HomeHealthRequestsPage from './components/Dashboard/HomeHealthRequestsPage';
import DoctorLabRequests from './components/Dashboard/DoctorLabRequests';
import ScrollToTop from './components/ScrollToTop';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const { user: patientUser } = useAuth();

  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="evde-saglik" element={<EvdeSaglikPage />} />
          <Route path="hekimlerimiz" element={<DoctorsPage />} />
          <Route path="doktor/:id" element={<DoctorBioPage />} />
          <Route path="doktor-sec" element={<SelectDoctorPage />} />
          <Route path="randevu" element={<AppointmentPage />} />
          <Route path="kurumsal" element={<KurumsalPage />} />
          <Route path="bolumlerimiz" element={<BolumlerimizPage />} />
          <Route path="birimlerimiz" element={<BirimlerimizPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
          <Route path="resend-verification" element={<ResendVerificationPage />} />

          <Route
            path="profile"
            element={patientUser ? <PatientDashboard /> : <ProfilePage />}
          />
        </Route>

        <Route path="/personelLogin" element={<PersonelLoginPage />} />

        <Route path="/doctor-display" element={<DoctorDisplayPage />} />

        <Route element={<ProtectedPersonnelRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />

            <Route path="personnel" element={<PersonnelPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="leave-requests" element={<LeaveRequestsPage />} />
            <Route path="contact-forms" element={<ContactFormsPage />} />
            <Route path="home-health" element={<HomeHealthRequestsPage />} />
            <Route path="lab-results" element={<LabResultsPage />} />
            <Route path="cleaning" element={<CleaningManagementPage />} />

            <Route path="lab-requests" element={<DoctorLabRequests />} />

            <Route path="cleaner" element={<CleanerDashboard />} />
            <Route path="payments" element={<CashierDashboard />} />
            <Route path="lab-tests" element={<LabTechDashboard />} />
            <Route path="laborant" element={<LaborantDashboard />} />

            <Route path="my-appointments" element={<PatientDashboard />} />

            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="/aydinlatma-metni" element={<ClarificationTextPage />} />
      </Routes>
    </ThemeProvider>
  );
}
