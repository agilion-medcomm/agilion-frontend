// src/components/Layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu/Menu';           
import Footer from '../Footer/Footer';
import FloatingButtons from '../FloatingButtons/FloatingButtons';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext'; 

export default function MainLayout() {
  const { user: personnelUser } = usePersonnelAuth(); 

  // Mantık: CSS yapısını (.site, .main) asla bozma.
  // Sadece içindeki bileşenleri (Menu, Footer) koşullu olarak göster.
  
  return (
    <div className="main-page"> 
      <div className="site">
        
        {/* Personel DEĞİLSE Menüyü göster */}
        {!personnelUser && <Menu />}

        {/* İçerik her zaman .main içinde olmalı ki CSS bozulmasın */}
        <main className="main" style={personnelUser ? { paddingTop: 0 } : {}}>
          <Outlet />
        </main>

        {/* Personel DEĞİLSE Footer ve Butonları göster */}
        {!personnelUser && <Footer />}
        {!personnelUser && <FloatingButtons />}
        
      </div>
    </div>
  );
}