
import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '../Menu/Menu';
import Footer from '../Footer/Footer';
import FloatingButtons from '../FloatingButtons/FloatingButtons';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';

export default function MainLayout() {
  const { user: personnelUser } = usePersonnelAuth();

  return (
    <div className="main-page">
      <div className="site">

        {!personnelUser && <Menu />}

        <main className="main" style={personnelUser ? { paddingTop: 0 } : {}}>
          <Outlet />
        </main>

        {!personnelUser && <Footer />}
        {!personnelUser && <FloatingButtons />}

      </div>
    </div>
  );
}
