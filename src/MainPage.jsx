import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from './context/StaffAuthContext'; // Personel kontrolü için
import './MainPage.css';

import ExpertSection from "./components/ExpertSection/ExpertSection";
import Bolumler from "./components/Bolumler/Bolumler";
import FAQ from "./components/FAQ/FAQ";
import Stats from "./components/Stats/Stats";
import Hero from './components/Hero_Img/Hero';
import FloatingButtons from './components/FloatingButtons/FloatingButtons';

export default function MainPage() {
	const { user: staffUser } = useStaffAuth(); // Giriş yapmış personel var mı?
	const navigate = useNavigate();

	// 🔥 PERSONEL KONTROLÜ VE YÖNLENDİRME 🔥
	useEffect(() => {
		   if (staffUser) {
			   // Eğer personel giriş yapmışsa, onu ana sayfada tutma, paneline gönder.
			   switch (staffUser.role) {
				   case 'ADMIN':
					   navigate('/personelLogin/admin-panel', { replace: true });
					   break;
				   case 'DOCTOR':
					   navigate('/personelLogin/doctor-panel', { replace: true });
					   break;
				   case 'LAB_TECHNICIAN':
					   navigate('/personelLogin/lab-panel', { replace: true });
					   break;
				   case 'CASHIER':
					   navigate('/personelLogin/cashier-panel', { replace: true });
					   break;
				   case 'CLEANER':
					   navigate('/personelLogin/cleaner-panel', { replace: true });
					   break;
				   default:
					   // Bilinmeyen rol ise bir şey yapma
					   break;
			   }
		   }
	}, [staffUser, navigate]);

	// Eğer personel DEĞİLSE (Hasta veya Ziyaretçi), normal ana sayfayı göster.
	return (
		<>
			<Hero />
			<ExpertSection />
			<Bolumler />
			<FAQ />
			{/* <Doctors /> kaldırıldı, ayrı sayfa oldu */}
			<Stats />
			<FloatingButtons />
		</>
	);
}
