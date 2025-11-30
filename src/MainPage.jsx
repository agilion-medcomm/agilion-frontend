// src/MainPage.jsx (GÜNCEL VE TAM KOD)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from './context/StaffAuthContext'; 
import './MainPage.css';

import ExpertSection from "./components/ExpertSection/ExpertSection";
import Bolumler from "./components/Bolumler/Bolumler";
import FAQ from "./components/FAQ/FAQ";
import Doctors from "./components/Doctors/Doctors"; // 🔥 SİLİNECEK: Artık sadece DoctorSlider kullanılıyor
import Stats from "./components/Stats/Stats";
import Hero from './components/Hero_Img/Hero';
import DoctorSlider from './components/DoctorSlider/DoctorSlider'; 

export default function MainPage() {
	const { user: staffUser } = useStaffAuth(); 
	const navigate = useNavigate();

	// PERSONEL KONTROLÜ VE YÖNLENDİRME (Aynı kalır)
	useEffect(() => {
		   if (staffUser) {
			   switch (staffUser.role) {
				   case 'ADMIN':
					   navigate('/admin-panel', { replace: true });
					   break;
				   case 'DOCTOR':
					   navigate('/doctor-panel', { replace: true });
					   break;
				   case 'LAB_TECHNICIAN':
					   navigate('/lab-panel', { replace: true });
					   break;
				   case 'CASHIER':
					   navigate('/cashier-panel', { replace: true });
					   break;
				   case 'CLEANER':
					   navigate('/cleaner-panel', { replace: true });
					   break;
				   default:
					   break;
			   }
		   }
	}, [personnelUser, navigate]);

	return (
		<>
			<Hero />
			<ExpertSection />
			<Bolumler />
			<FAQ />
			{/* 🔥 ESKİ DOCTOR LISTESİ KALDIRILDI: Mükerrer listeyi önler */}
			{/* <Doctors /> */}
			<Stats />
			{/* 🔥 YENİ DOKTOR SLIDER: Sadece bu kalır */}
			<DoctorSlider /> 
		</>
	);
}