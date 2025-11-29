// src/MainPage.jsx (GÜNCEL VE TAM KOD)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { usePersonnelAuth } from './context/PersonnelAuthContext'; 
=======
import { useStaffAuth } from './context/StaffAuthContext'; 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
import './MainPage.css';

import ExpertSection from "./components/ExpertSection/ExpertSection";
import Bolumler from "./components/Bolumler/Bolumler";
import FAQ from "./components/FAQ/FAQ";
import Doctors from "./components/Doctors/Doctors"; // 🔥 SİLİNECEK: Artık sadece DoctorSlider kullanılıyor
import Stats from "./components/Stats/Stats";
import Hero from './components/Hero_Img/Hero';
import DoctorSlider from './components/DoctorSlider/DoctorSlider'; 

export default function MainPage() {
<<<<<<< HEAD
	const { user: personnelUser } = usePersonnelAuth(); 
=======
	const { user: staffUser } = useStaffAuth(); 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
	const navigate = useNavigate();

	// PERSONEL KONTROLÜ VE YÖNLENDİRME (Aynı kalır)
	useEffect(() => {
<<<<<<< HEAD
		   if (personnelUser) {
			   switch (personnelUser.role) {
=======
		   if (staffUser) {
			   switch (staffUser.role) {
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
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
<<<<<<< HEAD
			<DoctorSlider /> 
			<Stats />
			
=======
			{/* 🔥 ESKİ DOCTOR LISTESİ KALDIRILDI: Mükerrer listeyi önler */}
			{/* <Doctors /> */}
			<Stats />
			{/* 🔥 YENİ DOKTOR SLIDER: Sadece bu kalır */}
			<DoctorSlider /> 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
		</>
	);
}