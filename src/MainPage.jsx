// src/MainPage.jsx (GÜNCEL VE TAM KOD)

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from './context/PersonnelAuthContext'; 
import './MainPage.css';

import ExpertSection from "./components/ExpertSection/ExpertSection";
import Bolumler from "./components/Bolumler/Bolumler";
import FAQ from "./components/FAQ/FAQ";
import Doctors from "./components/Doctors/Doctors"; // 🔥 SİLİNECEK: Artık sadece DoctorSlider kullanılıyor
import Stats from "./components/Stats/Stats";
import Hero from './components/Hero_Img/Hero';
import DoctorSlider from './components/DoctorSlider/DoctorSlider'; 

export default function MainPage() {
	const { user: personnelUser } = usePersonnelAuth(); 
	const navigate = useNavigate();

	// PERSONEL KONTROLÜ VE YÖNLENDİRME (Aynı kalır)
	useEffect(() => {
		   if (personnelUser) {
			   switch (personnelUser.role) {
				   case 'ADMIN':
					   navigate('/dashboard', { replace: true });
					   break;
				   case 'DOCTOR':
					   navigate('/dashboard', { replace: true });
					   break;
				   case 'LABORANT':
					   navigate('/dashboard/laborant', { replace: true });
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
			<DoctorSlider /> 
			<Stats />
			
		</>
	);
}