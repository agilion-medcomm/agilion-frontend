// src/components/Layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu/Menu';           
import Footer from '../Footer/Footer';
import FloatingButtons from '../FloatingButtons/FloatingButtons';
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
import { usePersonnelAuth } from '../../context/PersonnelAuthContext'; 

export default function MainLayout() {
  const { user: personnelUser } = usePersonnelAuth(); 
<<<<<<< HEAD

=======
=======
import { useStaffAuth } from '../../context/StaffAuthContext'; 

export default function MainLayout() {
  const { user: staffUser } = useStaffAuth(); 
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc

>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
  // Mantık: CSS yapısını (.site, .main) asla bozma.
  // Sadece içindeki bileşenleri (Menu, Footer) koşullu olarak göster.
  
  return (
    <div className="main-page"> 
      <div className="site">
        
        {/* Personel DEĞİLSE Menüyü göster */}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
        {!personnelUser && <Menu />}

        {/* İçerik her zaman .main içinde olmalı ki CSS bozulmasın */}
        <main className="main" style={personnelUser ? { paddingTop: 0 } : {}}>
<<<<<<< HEAD
=======
=======
        {!staffUser && <Menu />}

        {/* İçerik her zaman .main içinde olmalı ki CSS bozulmasın */}
        <main className="main" style={staffUser ? { paddingTop: 0 } : {}}>
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
          <Outlet />
        </main>

        {/* Personel DEĞİLSE Footer ve Butonları göster */}
<<<<<<< HEAD
        {!personnelUser && <Footer />}
        {!personnelUser && <FloatingButtons />}
=======
<<<<<<< HEAD
        {!personnelUser && <Footer />}
        {!personnelUser && <FloatingButtons />}
=======
        {!staffUser && <Footer />}
        {!staffUser && <FloatingButtons />}
>>>>>>> 1da83ba77b9c43c3aa8eebe771eb59e430f255bc
>>>>>>> 5584bb8d6b5d740a61a9ed2c5d97fa376afa9c6a
        
      </div>
    </div>
  );
}