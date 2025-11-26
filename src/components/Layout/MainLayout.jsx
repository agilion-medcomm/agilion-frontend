// src/components/Layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu/Menu';           
import Footer from '../Footer/Footer';
import FloatingButtons from '../FloatingButtons/FloatingButtons';
<<<<<<< HEAD
import { usePersonnelAuth } from '../../context/PersonnelAuthContext'; 

export default function MainLayout() {
  const { user: personnelUser } = usePersonnelAuth(); 
=======
import { useStaffAuth } from '../../context/StaffAuthContext'; 

export default function MainLayout() {
  const { user: staffUser } = useStaffAuth(); 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc

  // Mantık: CSS yapısını (.site, .main) asla bozma.
  // Sadece içindeki bileşenleri (Menu, Footer) koşullu olarak göster.
  
  return (
    <div className="main-page"> 
      <div className="site">
        
        {/* Personel DEĞİLSE Menüyü göster */}
<<<<<<< HEAD
        {!personnelUser && <Menu />}

        {/* İçerik her zaman .main içinde olmalı ki CSS bozulmasın */}
        <main className="main" style={personnelUser ? { paddingTop: 0 } : {}}>
=======
        {!staffUser && <Menu />}

        {/* İçerik her zaman .main içinde olmalı ki CSS bozulmasın */}
        <main className="main" style={staffUser ? { paddingTop: 0 } : {}}>
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
          <Outlet />
        </main>

        {/* Personel DEĞİLSE Footer ve Butonları göster */}
<<<<<<< HEAD
        {!personnelUser && <Footer />}
        {!personnelUser && <FloatingButtons />}
=======
        {!staffUser && <Footer />}
        {!staffUser && <FloatingButtons />}
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
        
      </div>
    </div>
  );
}